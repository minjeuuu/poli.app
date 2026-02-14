export class Integration72 {
  private baseUrl = 'https://api.poli.app/v1';
  private cache = new Map();

  async fetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    const cacheKey = endpoint + JSON.stringify(options);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      const data = await response.json();
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Integration 72 error:', error);
      return { error: true, integration: 72 };
    }
  }

  async get(endpoint: string) {
    return this.fetch(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data: any) {
    return this.fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint: string, data: any) {
    return this.fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint: string) {
    return this.fetch(endpoint, { method: 'DELETE' });
  }

  clearCache() {
    this.cache.clear();
  }
}

export const integration72 = new Integration72();
