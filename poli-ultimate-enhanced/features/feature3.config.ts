export const Feature3Config = {
  enabled: true,
  name: 'Feature 3',
  version: '1.0.0',
  settings: {
    maxItems: 100,
    timeout: 5000,
    retries: 3,
    cache: true
  },
  permissions: ['read', 'write', 'delete'],
  dependencies: [],
  initialize: async () => {
    console.log('Feature 3 initialized');
    return true;
  },
  cleanup: async () => {
    console.log('Feature 3 cleaned up');
  }
};
