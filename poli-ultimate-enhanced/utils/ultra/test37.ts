export const testUtil37 = {
  // Mock data generator
  generateMock: (schema: any) => {
    return {
      id: Math.random().toString(36).substring(7),
      ...schema,
      createdAt: new Date().toISOString(),
      util: 37
    };
  },

  // Performance measurement
  measure: async (name: string, fn: Function) => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    console.log(`[${name}] took ${(end - start).toFixed(2)}ms`);
    return end - start;
  },

  // Assert helper
  assert: (condition: boolean, message: string) => {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  },

  // Deep equal
  deepEqual: (a: any, b: any): boolean => {
    return JSON.stringify(a) === JSON.stringify(b);
  },

  // Wait helper
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Retry helper
  retry: async <T>(fn: () => Promise<T>, maxRetries: number = 3): Promise<T> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await testUtil37.wait(1000 * (i + 1));
      }
    }
    throw new Error('Max retries exceeded');
  }
};
