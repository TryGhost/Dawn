Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const core = require('@sentry/core');
const importInTheMiddle = require('import-in-the-middle');
const moduleModule = require('module');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
/** Initialize the ESM loader. */
function maybeInitializeEsmLoader() {
  const [nodeMajor = 0, nodeMinor = 0] = process.versions.node.split('.').map(Number);

  // Register hook was added in v20.6.0 and v18.19.0
  if (nodeMajor >= 21 || (nodeMajor === 20 && nodeMinor >= 6) || (nodeMajor === 18 && nodeMinor >= 19)) {
    if (!core.GLOBAL_OBJ._sentryEsmLoaderHookRegistered) {
      try {
        const { addHookMessagePort } = importInTheMiddle.createAddHookMessageChannel();
        // @ts-expect-error register is available in these versions
        moduleModule.default.register('import-in-the-middle/hook.mjs', (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('sdk/esmLoader.js', document.baseURI).href)), {
          data: { addHookMessagePort, include: [] },
          transferList: [addHookMessagePort],
        });
      } catch (error) {
        core.debug.warn('Failed to register ESM hook', error);
      }
    }
  } else {
    core.consoleSandbox(() => {
      // eslint-disable-next-line no-console
      console.warn(
        `[Sentry] You are using Node.js v${process.versions.node} in ESM mode ("import syntax"). The Sentry Node.js SDK is not compatible with ESM in Node.js versions before 18.19.0 or before 20.6.0. Please either build your application with CommonJS ("require() syntax"), or upgrade your Node.js version.`,
      );
    });
  }
}

exports.maybeInitializeEsmLoader = maybeInitializeEsmLoader;
//# sourceMappingURL=esmLoader.js.map
