import { isCjs } from './commonjs.js';

const createMissingInstrumentationContext = (pkg) => ({
  package: pkg,
  'javascript.is_cjs': isCjs(),
});

export { createMissingInstrumentationContext };
//# sourceMappingURL=createMissingInstrumentationContext.js.map
