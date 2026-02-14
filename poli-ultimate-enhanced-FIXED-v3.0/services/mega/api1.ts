export const api1 = {
  endpoint: '/api/v1/feature1',
  
  async get(id?: string) {
    return { method: 'GET', endpoint: this.endpoint, id, feature: 1 };
  },
  
  async post(data: any) {
    return { method: 'POST', endpoint: this.endpoint, data, feature: 1 };
  },
  
  async put(id: string, data: any) {
    return { method: 'PUT', endpoint: this.endpoint, id, data, feature: 1 };
  },
  
  async delete(id: string) {
    return { method: 'DELETE', endpoint: this.endpoint, id, feature: 1 };
  },
  
  async batch(operations: any[]) {
    return { method: 'BATCH', operations, feature: 1 };
  }
};
