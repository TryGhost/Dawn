Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const node_worker_threads = require('node:worker_threads');
const core = require('@sentry/core');
const debug = require('../../utils/debug.js');
const common = require('./common.js');

// This string is a placeholder that gets overwritten with the worker code.
const base64WorkerScript = 'LyohIEBzZW50cnkvbm9kZS1jb3JlIDkuNDcuMSAoNDExZTEwMikgfCBodHRwczovL2dpdGh1Yi5jb20vZ2V0c2VudHJ5L3NlbnRyeS1qYXZhc2NyaXB0ICovCmltcG9ydHtTZXNzaW9uIGFzIGV9ZnJvbSJub2RlOmluc3BlY3Rvci9wcm9taXNlcyI7aW1wb3J0e3dvcmtlckRhdGEgYXMgdH1mcm9tIm5vZGU6d29ya2VyX3RocmVhZHMiO2NvbnN0IG49Z2xvYmFsVGhpcyxpPXt9O2NvbnN0IG89Il9fU0VOVFJZX0VSUk9SX0xPQ0FMX1ZBUklBQkxFU19fIjtjb25zdCBhPXQ7ZnVuY3Rpb24gcyguLi5lKXthLmRlYnVnJiZmdW5jdGlvbihlKXtpZighKCJjb25zb2xlImluIG4pKXJldHVybiBlKCk7Y29uc3QgdD1uLmNvbnNvbGUsbz17fSxhPU9iamVjdC5rZXlzKGkpO2EuZm9yRWFjaChlPT57Y29uc3Qgbj1pW2VdO29bZV09dFtlXSx0W2VdPW59KTt0cnl7cmV0dXJuIGUoKX1maW5hbGx5e2EuZm9yRWFjaChlPT57dFtlXT1vW2VdfSl9fSgoKT0+Y29uc29sZS5sb2coIltMb2NhbFZhcmlhYmxlcyBXb3JrZXJdIiwuLi5lKSl9YXN5bmMgZnVuY3Rpb24gYyhlLHQsbixpKXtjb25zdCBvPWF3YWl0IGUucG9zdCgiUnVudGltZS5nZXRQcm9wZXJ0aWVzIix7b2JqZWN0SWQ6dCxvd25Qcm9wZXJ0aWVzOiEwfSk7aVtuXT1vLnJlc3VsdC5maWx0ZXIoZT0+Imxlbmd0aCIhPT1lLm5hbWUmJiFpc05hTihwYXJzZUludChlLm5hbWUsMTApKSkuc29ydCgoZSx0KT0+cGFyc2VJbnQoZS5uYW1lLDEwKS1wYXJzZUludCh0Lm5hbWUsMTApKS5tYXAoZT0+ZS52YWx1ZT8udmFsdWUpfWFzeW5jIGZ1bmN0aW9uIHIoZSx0LG4saSl7Y29uc3Qgbz1hd2FpdCBlLnBvc3QoIlJ1bnRpbWUuZ2V0UHJvcGVydGllcyIse29iamVjdElkOnQsb3duUHJvcGVydGllczohMH0pO2lbbl09by5yZXN1bHQubWFwKGU9PltlLm5hbWUsZS52YWx1ZT8udmFsdWVdKS5yZWR1Y2UoKGUsW3Qsbl0pPT4oZVt0XT1uLGUpLHt9KX1mdW5jdGlvbiB1KGUsdCl7ZS52YWx1ZSYmKCJ2YWx1ZSJpbiBlLnZhbHVlP3ZvaWQgMD09PWUudmFsdWUudmFsdWV8fG51bGw9PT1lLnZhbHVlLnZhbHVlP3RbZS5uYW1lXT1gPCR7ZS52YWx1ZS52YWx1ZX0+YDp0W2UubmFtZV09ZS52YWx1ZS52YWx1ZToiZGVzY3JpcHRpb24iaW4gZS52YWx1ZSYmImZ1bmN0aW9uIiE9PWUudmFsdWUudHlwZT90W2UubmFtZV09YDwke2UudmFsdWUuZGVzY3JpcHRpb259PmA6InVuZGVmaW5lZCI9PT1lLnZhbHVlLnR5cGUmJih0W2UubmFtZV09Ijx1bmRlZmluZWQ+IikpfWFzeW5jIGZ1bmN0aW9uIGwoZSx0KXtjb25zdCBuPWF3YWl0IGUucG9zdCgiUnVudGltZS5nZXRQcm9wZXJ0aWVzIix7b2JqZWN0SWQ6dCxvd25Qcm9wZXJ0aWVzOiEwfSksaT17fTtmb3IoY29uc3QgdCBvZiBuLnJlc3VsdClpZih0LnZhbHVlPy5vYmplY3RJZCYmIkFycmF5Ij09PXQudmFsdWUuY2xhc3NOYW1lKXtjb25zdCBuPXQudmFsdWUub2JqZWN0SWQ7YXdhaXQgYyhlLG4sdC5uYW1lLGkpfWVsc2UgaWYodC52YWx1ZT8ub2JqZWN0SWQmJiJPYmplY3QiPT09dC52YWx1ZS5jbGFzc05hbWUpe2NvbnN0IG49dC52YWx1ZS5vYmplY3RJZDthd2FpdCByKGUsbix0Lm5hbWUsaSl9ZWxzZSB0LnZhbHVlJiZ1KHQsaSk7cmV0dXJuIGl9bGV0IGY7KGFzeW5jIGZ1bmN0aW9uKCl7Y29uc3QgdD1uZXcgZTt0LmNvbm5lY3RUb01haW5UaHJlYWQoKSxzKCJDb25uZWN0ZWQgdG8gbWFpbiB0aHJlYWQiKTtsZXQgbj0hMTt0Lm9uKCJEZWJ1Z2dlci5yZXN1bWVkIiwoKT0+e249ITF9KSx0Lm9uKCJEZWJ1Z2dlci5wYXVzZWQiLGU9PntuPSEwLGFzeW5jIGZ1bmN0aW9uKGUse3JlYXNvbjp0LGRhdGE6e29iamVjdElkOm59LGNhbGxGcmFtZXM6aX0pe2lmKCJleGNlcHRpb24iIT09dCYmInByb21pc2VSZWplY3Rpb24iIT09dClyZXR1cm47aWYoZj8uKCksbnVsbD09bilyZXR1cm47Y29uc3QgYT1bXTtmb3IobGV0IHQ9MDt0PGkubGVuZ3RoO3QrKyl7Y29uc3R7c2NvcGVDaGFpbjpuLGZ1bmN0aW9uTmFtZTpvLHRoaXM6c309aVt0XSxjPW4uZmluZChlPT4ibG9jYWwiPT09ZS50eXBlKSxyPSJnbG9iYWwiIT09cy5jbGFzc05hbWUmJnMuY2xhc3NOYW1lP2Ake3MuY2xhc3NOYW1lfS4ke299YDpvO2lmKHZvaWQgMD09PWM/Lm9iamVjdC5vYmplY3RJZClhW3RdPXtmdW5jdGlvbjpyfTtlbHNle2NvbnN0IG49YXdhaXQgbChlLGMub2JqZWN0Lm9iamVjdElkKTthW3RdPXtmdW5jdGlvbjpyLHZhcnM6bn19fWF3YWl0IGUucG9zdCgiUnVudGltZS5jYWxsRnVuY3Rpb25PbiIse2Z1bmN0aW9uRGVjbGFyYXRpb246YGZ1bmN0aW9uKCkgeyB0aGlzLiR7b30gPSB0aGlzLiR7b30gfHwgJHtKU09OLnN0cmluZ2lmeShhKX07IH1gLHNpbGVudDohMCxvYmplY3RJZDpufSksYXdhaXQgZS5wb3N0KCJSdW50aW1lLnJlbGVhc2VPYmplY3QiLHtvYmplY3RJZDpufSl9KHQsZS5wYXJhbXMpLnRoZW4oYXN5bmMoKT0+e24mJmF3YWl0IHQucG9zdCgiRGVidWdnZXIucmVzdW1lIil9LGFzeW5jIGU9PntuJiZhd2FpdCB0LnBvc3QoIkRlYnVnZ2VyLnJlc3VtZSIpfSl9KSxhd2FpdCB0LnBvc3QoIkRlYnVnZ2VyLmVuYWJsZSIpO2NvbnN0IGk9ITEhPT1hLmNhcHR1cmVBbGxFeGNlcHRpb25zO2lmKGF3YWl0IHQucG9zdCgiRGVidWdnZXIuc2V0UGF1c2VPbkV4Y2VwdGlvbnMiLHtzdGF0ZTppPyJhbGwiOiJ1bmNhdWdodCJ9KSxpKXtjb25zdCBlPWEubWF4RXhjZXB0aW9uc1BlclNlY29uZHx8NTA7Zj1mdW5jdGlvbihlLHQsbil7bGV0IGk9MCxvPTUsYT0wO3JldHVybiBzZXRJbnRlcnZhbCgoKT0+ezA9PT1hP2k+ZSYmKG8qPTIsbihvKSxvPjg2NDAwJiYobz04NjQwMCksYT1vKTooYS09MSwwPT09YSYmdCgpKSxpPTB9LDFlMykudW5yZWYoKSwoKT0+e2krPTF9fShlLGFzeW5jKCk9PntzKCJSYXRlLWxpbWl0IGxpZnRlZC4iKSxhd2FpdCB0LnBvc3QoIkRlYnVnZ2VyLnNldFBhdXNlT25FeGNlcHRpb25zIix7c3RhdGU6ImFsbCJ9KX0sYXN5bmMgZT0+e3MoYFJhdGUtbGltaXQgZXhjZWVkZWQuIERpc2FibGluZyBjYXB0dXJpbmcgb2YgY2F1Z2h0IGV4Y2VwdGlvbnMgZm9yICR7ZX0gc2Vjb25kcy5gKSxhd2FpdCB0LnBvc3QoIkRlYnVnZ2VyLnNldFBhdXNlT25FeGNlcHRpb25zIix7c3RhdGU6InVuY2F1Z2h0In0pfSl9fSkoKS5jYXRjaChlPT57cygiRmFpbGVkIHRvIHN0YXJ0IGRlYnVnZ2VyIixlKX0pLHNldEludGVydmFsKCgpPT57fSwxZTQpOw==';

function log(...args) {
  core.debug.log('[LocalVariables]', ...args);
}

/**
 * Adds local variables to exception frames
 */
const localVariablesAsyncIntegration = core.defineIntegration(((
  integrationOptions = {},
) => {
  function addLocalVariablesToException(exception, localVariables) {
    // Filter out frames where the function name is `new Promise` since these are in the error.stack frames
    // but do not appear in the debugger call frames
    const frames = (exception.stacktrace?.frames || []).filter(frame => frame.function !== 'new Promise');

    for (let i = 0; i < frames.length; i++) {
      // Sentry frames are in reverse order
      const frameIndex = frames.length - i - 1;

      const frameLocalVariables = localVariables[i];
      const frame = frames[frameIndex];

      if (!frame || !frameLocalVariables) {
        // Drop out if we run out of frames to match up
        break;
      }

      if (
        // We need to have vars to add
        frameLocalVariables.vars === undefined ||
        // We're not interested in frames that are not in_app because the vars are not relevant
        frame.in_app === false ||
        // The function names need to match
        !common.functionNamesMatch(frame.function, frameLocalVariables.function)
      ) {
        continue;
      }

      frame.vars = frameLocalVariables.vars;
    }
  }

  function addLocalVariablesToEvent(event, hint) {
    if (
      hint.originalException &&
      typeof hint.originalException === 'object' &&
      common.LOCAL_VARIABLES_KEY in hint.originalException &&
      Array.isArray(hint.originalException[common.LOCAL_VARIABLES_KEY])
    ) {
      for (const exception of event.exception?.values || []) {
        addLocalVariablesToException(exception, hint.originalException[common.LOCAL_VARIABLES_KEY]);
      }

      hint.originalException[common.LOCAL_VARIABLES_KEY] = undefined;
    }

    return event;
  }

  async function startInspector() {
    // We load inspector dynamically because on some platforms Node is built without inspector support
    const inspector = await import('node:inspector');
    if (!inspector.url()) {
      inspector.open(0);
    }
  }

  function startWorker(options) {
    const worker = new node_worker_threads.Worker(new URL(`data:application/javascript;base64,${base64WorkerScript}`), {
      workerData: options,
      // We don't want any Node args to be passed to the worker
      execArgv: [],
      env: { ...process.env, NODE_OPTIONS: undefined },
    });

    process.on('exit', () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      worker.terminate();
    });

    worker.once('error', (err) => {
      log('Worker error', err);
    });

    worker.once('exit', (code) => {
      log('Worker exit', code);
    });

    // Ensure this thread can't block app exit
    worker.unref();
  }

  return {
    name: 'LocalVariablesAsync',
    async setup(client) {
      const clientOptions = client.getOptions();

      if (!clientOptions.includeLocalVariables) {
        return;
      }

      if (await debug.isDebuggerEnabled()) {
        core.debug.warn('Local variables capture has been disabled because the debugger was already enabled');
        return;
      }

      const options = {
        ...integrationOptions,
        debug: core.debug.isEnabled(),
      };

      startInspector().then(
        () => {
          try {
            startWorker(options);
          } catch (e) {
            core.debug.error('Failed to start worker', e);
          }
        },
        e => {
          core.debug.error('Failed to start inspector', e);
        },
      );
    },
    processEvent(event, hint) {
      return addLocalVariablesToEvent(event, hint);
    },
  };
}) );

exports.base64WorkerScript = base64WorkerScript;
exports.localVariablesAsyncIntegration = localVariablesAsyncIntegration;
//# sourceMappingURL=local-variables-async.js.map
