// Stand-in for Pi's bundled typebox; the schema is never validated in tests.
export const Type = new Proxy({}, { get: () => (...args) => args });
