import { AttributeNames } from './enums/AttributeNames.js';
import { ExpressLayerType } from './enums/ExpressLayerType.js';
import { _LAYERS_STORE_PROPERTY } from './internal-types.js';

/**
 * Store layers path in the request to be able to construct route later
 * @param request The request where
 * @param [value] the value to push into the array
 */
const storeLayerPath = (request, value) => {
  if (Array.isArray(request[_LAYERS_STORE_PROPERTY]) === false) {
    Object.defineProperty(request, _LAYERS_STORE_PROPERTY, {
      enumerable: false,
      value: [],
    });
  }
  if (value === undefined) return;
  (request[_LAYERS_STORE_PROPERTY] ).push(value);
};

/**
 * Recursively search the router path from layer stack
 * @param path The path to reconstruct
 * @param layer The layer to reconstruct from
 * @returns The reconstructed path
 */
const getRouterPath = (path, layer) => {
  const stackLayer = layer.handle?.stack?.[0];

  if (stackLayer?.route?.path) {
    return `${path}${stackLayer.route.path}`;
  }

  if (stackLayer?.handle?.stack) {
    return getRouterPath(path, stackLayer);
  }

  return path;
};

/**
 * Parse express layer context to retrieve a name and attributes.
 * @param route The route of the layer
 * @param layer Express layer
 * @param [layerPath] if present, the path on which the layer has been mounted
 */
const getLayerMetadata = (
  route,
  layer,
  layerPath,

) => {
  if (layer.name === 'router') {
    const maybeRouterPath = getRouterPath('', layer);
    const extractedRouterPath = maybeRouterPath ? maybeRouterPath : layerPath || route || '/';

    return {
      attributes: {
        [AttributeNames.EXPRESS_NAME]: extractedRouterPath,
        [AttributeNames.EXPRESS_TYPE]: ExpressLayerType.ROUTER,
      },
      name: `router - ${extractedRouterPath}`,
    };
  } else if (layer.name === 'bound dispatch' || layer.name === 'handle') {
    return {
      attributes: {
        [AttributeNames.EXPRESS_NAME]: (route || layerPath) ?? 'request handler',
        [AttributeNames.EXPRESS_TYPE]: ExpressLayerType.REQUEST_HANDLER,
      },
      name: `request handler${layer.path ? ` - ${route || layerPath}` : ''}`,
    };
  } else {
    return {
      attributes: {
        [AttributeNames.EXPRESS_NAME]: layer.name,
        [AttributeNames.EXPRESS_TYPE]: ExpressLayerType.MIDDLEWARE,
      },
      name: `middleware - ${layer.name}`,
    };
  }
};

/**
 * Check whether the given obj match pattern
 * @param constant e.g URL of request
 * @param obj obj to inspect
 * @param pattern Match pattern
 */
const satisfiesPattern = (constant, pattern) => {
  if (typeof pattern === 'string') {
    return pattern === constant;
  } else if (pattern instanceof RegExp) {
    return pattern.test(constant);
  } else if (typeof pattern === 'function') {
    return pattern(constant);
  } else {
    throw new TypeError('Pattern is in unsupported datatype');
  }
};

/**
 * Check whether the given request is ignored by configuration
 * It will not re-throw exceptions from `list` provided by the client
 * @param constant e.g URL of request
 * @param [list] List of ignore patterns
 * @param [onException] callback for doing something when an exception has
 *     occurred
 */
const isLayerIgnored = (
  name,
  type,
  config,
) => {
  if (Array.isArray(config?.ignoreLayersType) && config?.ignoreLayersType?.includes(type)) {
    return true;
  }
  if (Array.isArray(config?.ignoreLayers) === false) return false;
  try {
    for (const pattern of config.ignoreLayers) {
      if (satisfiesPattern(name, pattern)) {
        return true;
      }
    }
  } catch {
    /* catch block */
  }

  return false;
};

/**
 * Converts a user-provided error value into an error and error message pair
 *
 * @param error - User-provided error value
 * @returns Both an Error or string representation of the value and an error message
 */
const asErrorAndMessage = (error) =>
  error instanceof Error ? [error, error.message] : [String(error), String(error)];

/**
 * Extracts the layer path from the route arguments
 *
 * @param args - Arguments of the route
 * @returns The layer path
 */
const getLayerPath = (args) => {
  const firstArg = args[0];

  if (Array.isArray(firstArg)) {
    return firstArg.map(arg => extractLayerPathSegment(arg) || '').join(',');
  }

  return extractLayerPathSegment(firstArg);
};

const extractLayerPathSegment = (arg) => {
  if (typeof arg === 'string') {
    return arg;
  }

  if (arg instanceof RegExp || typeof arg === 'number') {
    return arg.toString();
  }

  return;
};

export { asErrorAndMessage, getLayerMetadata, getLayerPath, getRouterPath, isLayerIgnored, storeLayerPath };
//# sourceMappingURL=utils.js.map
