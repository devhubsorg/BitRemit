// Browser stub for React Native / Node-only modules bundled by MetaMask SDK.
// These are never called at runtime in the browser; this stub prevents
// "Module not found" build errors.
const noop = () => Promise.resolve(null);
const stub = {
  getItem: noop,
  setItem: noop,
  removeItem: noop,
  mergeItem: noop,
  clear: noop,
  getAllKeys: noop,
  multiGet: noop,
  multiSet: noop,
  multiRemove: noop,
  multiMerge: noop,
  flushGetRequests: () => {},
};

export default stub;
export const AsyncStorage = stub;
