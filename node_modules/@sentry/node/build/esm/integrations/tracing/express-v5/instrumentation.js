import { diag, context, trace, SpanStatusCode } from '@opentelemetry/api';
import { getRPCMetadata, RPCType } from '@opentelemetry/core';
import { InstrumentationBase, InstrumentationNodeModuleDefinition, isWrapped, safeExecuteInTheMiddle } from '@opentelemetry/instrumentation';
import { SEMATTRS_HTTP_ROUTE } from '@opentelemetry/semantic-conventions';
import { AttributeNames } from './enums/AttributeNames.js';
import { ExpressLayerType } from './enums/ExpressLayerType.js';
import { kLayerPatched, _LAYERS_STORE_PROPERTY } from './internal-types.js';
import { getLayerPath, storeLayerPath, getLayerMetadata, isLayerIgnored, asErrorAndMessage } from './utils.js';

const PACKAGE_VERSION = '0.1.0';
const PACKAGE_NAME = '@sentry/instrumentation-express-v5';

/** Express instrumentation for OpenTelemetry */
class ExpressInstrumentationV5 extends InstrumentationBase {
  constructor(config = {}) {
    super(PACKAGE_NAME, PACKAGE_VERSION, config);
  }

  init() {
    return [
      new InstrumentationNodeModuleDefinition(
        'express',
        ['>=5.0.0'],
        moduleExports => this._setup(moduleExports),
        moduleExports => this._tearDown(moduleExports),
      ),
    ];
  }

   _setup(moduleExports) {
    const routerProto = moduleExports.Router.prototype;
    // patch express.Router.route
    if (isWrapped(routerProto.route)) {
      this._unwrap(routerProto, 'route');
    }
    this._wrap(routerProto, 'route', this._getRoutePatch());
    // patch express.Router.use
    if (isWrapped(routerProto.use)) {
      this._unwrap(routerProto, 'use');
    }
    this._wrap(routerProto, 'use', this._getRouterUsePatch() );
    // patch express.Application.use
    if (isWrapped(moduleExports.application.use)) {
      this._unwrap(moduleExports.application, 'use');
    }
    this._wrap(moduleExports.application, 'use', this._getAppUsePatch() );
    return moduleExports;
  }

   _tearDown(moduleExports) {
    if (moduleExports === undefined) return;
    const routerProto = moduleExports.Router.prototype;
    this._unwrap(routerProto, 'route');
    this._unwrap(routerProto, 'use');
    this._unwrap(moduleExports.application, 'use');
  }

  /**
   * Get the patch for Router.route function
   */
   _getRoutePatch() {
    const instrumentation = this;
    return function (original) {
      return function route_trace( ...args) {
        const route = original.apply(this, args);
        const layer = this.stack[this.stack.length - 1] ;
        instrumentation._applyPatch(layer, getLayerPath(args));
        return route;
      };
    };
  }

  /**
   * Get the patch for Router.use function
   */
   _getRouterUsePatch() {
    const instrumentation = this;
    return function (original) {
      return function use( ...args) {
        const route = original.apply(this, args);
        const layer = this.stack[this.stack.length - 1] ;
        instrumentation._applyPatch(layer, getLayerPath(args));
        return route;
      };
    };
  }

  /**
   * Get the patch for Application.use function
   */
   _getAppUsePatch() {
    const instrumentation = this;
    return function (original) {
      return function use(
        // In express 5.x the router is stored in `router` whereas in 4.x it's stored in `_router`

        ...args
      ) {
        // if we access app.router in express 4.x we trigger an assertion error
        // This property existed in v3, was removed in v4 and then re-added in v5
        const router = this.router;
        const route = original.apply(this, args);
        if (router) {
          const layer = router.stack[router.stack.length - 1] ;
          instrumentation._applyPatch(layer, getLayerPath(args));
        }
        return route;
      };
    };
  }

  /** Patch each express layer to create span and propagate context */
   _applyPatch( layer, layerPath) {
    const instrumentation = this;
    // avoid patching multiple times the same layer
    if (layer[kLayerPatched] === true) return;
    layer[kLayerPatched] = true;

    this._wrap(layer, 'handle', original => {
      // TODO: instrument error handlers
      if (original.length === 4) return original;

      const patched = function ( req, res) {
        storeLayerPath(req, layerPath);
        const route = (req[_LAYERS_STORE_PROPERTY] )
          .filter(path => path !== '/' && path !== '/*')
          .join('')
          // remove duplicate slashes to normalize route
          .replace(/\/{2,}/g, '/');

        const actualRoute = route.length > 0 ? route : undefined;

        const attributes = {
          // eslint-disable-next-line deprecation/deprecation
          [SEMATTRS_HTTP_ROUTE]: actualRoute,
        };
        const metadata = getLayerMetadata(route, layer, layerPath);
        const type = metadata.attributes[AttributeNames.EXPRESS_TYPE] ;

        const rpcMetadata = getRPCMetadata(context.active());
        if (rpcMetadata?.type === RPCType.HTTP) {
          rpcMetadata.route = actualRoute;
        }

        // verify against the config if the layer should be ignored
        if (isLayerIgnored(metadata.name, type, instrumentation.getConfig())) {
          if (type === ExpressLayerType.MIDDLEWARE) {
            (req[_LAYERS_STORE_PROPERTY] ).pop();
          }
          return original.apply(this, arguments);
        }

        if (trace.getSpan(context.active()) === undefined) {
          return original.apply(this, arguments);
        }

        const spanName = instrumentation._getSpanName(
          {
            request: req,
            layerType: type,
            route,
          },
          metadata.name,
        );
        const span = instrumentation.tracer.startSpan(spanName, {
          attributes: Object.assign(attributes, metadata.attributes),
        });

        const { requestHook } = instrumentation.getConfig();
        if (requestHook) {
          safeExecuteInTheMiddle(
            () =>
              requestHook(span, {
                request: req,
                layerType: type,
                route,
              }),
            e => {
              if (e) {
                diag.error('express instrumentation: request hook failed', e);
              }
            },
            true,
          );
        }

        let spanHasEnded = false;
        if (metadata.attributes[AttributeNames.EXPRESS_TYPE] !== ExpressLayerType.MIDDLEWARE) {
          span.end();
          spanHasEnded = true;
        }
        // listener for response.on('finish')
        const onResponseFinish = () => {
          if (spanHasEnded === false) {
            spanHasEnded = true;
            span.end();
          }
        };

        // verify we have a callback
        const args = Array.from(arguments);
        const callbackIdx = args.findIndex(arg => typeof arg === 'function');
        if (callbackIdx >= 0) {
          arguments[callbackIdx] = function () {
            // express considers anything but an empty value, "route" or "router"
            // passed to its callback to be an error
            const maybeError = arguments[0];
            const isError = ![undefined, null, 'route', 'router'].includes(maybeError);
            if (!spanHasEnded && isError) {
              const [error, message] = asErrorAndMessage(maybeError);
              span.recordException(error);
              span.setStatus({
                code: SpanStatusCode.ERROR,
                message,
              });
            }

            if (spanHasEnded === false) {
              spanHasEnded = true;
              req.res?.removeListener('finish', onResponseFinish);
              span.end();
            }
            if (!(req.route && isError)) {
              (req[_LAYERS_STORE_PROPERTY] ).pop();
            }
            const callback = args[callbackIdx] ;
            return callback.apply(this, arguments);
          };
        }

        try {
          return original.apply(this, arguments);
        } catch (anyError) {
          const [error, message] = asErrorAndMessage(anyError);
          span.recordException(error);
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message,
          });
          throw anyError;
        } finally {
          /**
           * At this point if the callback wasn't called, that means either the
           * layer is asynchronous (so it will call the callback later on) or that
           * the layer directly end the http response, so we'll hook into the "finish"
           * event to handle the later case.
           */
          if (!spanHasEnded) {
            res.once('finish', onResponseFinish);
          }
        }
      };

      // `handle` isn't just a regular function in some cases. It also contains
      // some properties holding metadata and state so we need to proxy them
      // through through patched function
      // ref: https://github.com/open-telemetry/opentelemetry-js-contrib/issues/1950
      // Also some apps/libs do their own patching before OTEL and have these properties
      // in the proptotype. So we use a `for...in` loop to get own properties and also
      // any enumerable prop in the prototype chain
      // ref: https://github.com/open-telemetry/opentelemetry-js-contrib/issues/2271
      for (const key in original) {
        Object.defineProperty(patched, key, {
          get() {
            return original[key];
          },
          set(value) {
            original[key] = value;
          },
        });
      }
      return patched;
    });
  }

  _getSpanName(info, defaultName) {
    const { spanNameHook } = this.getConfig();

    if (!(spanNameHook instanceof Function)) {
      return defaultName;
    }

    try {
      return spanNameHook(info, defaultName) ?? defaultName;
    } catch (err) {
      diag.error('express instrumentation: error calling span name rewrite hook', err);
      return defaultName;
    }
  }
}

export { ExpressInstrumentationV5, PACKAGE_NAME, PACKAGE_VERSION };
//# sourceMappingURL=instrumentation.js.map
