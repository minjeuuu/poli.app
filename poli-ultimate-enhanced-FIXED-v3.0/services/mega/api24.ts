export const api24 = {
  endpoint: '/api/v1/feature24',
  
  async get(id?: string) {
    return { method: 'GET', endpoint: this.endpoint, id, feature: 24 };
  },
  
  async post(data: any) {
    return { method: 'POST', endpoint: this.endpoint, data, feature: 24 };
  },
  
  async put(id: string, data: any) {
    return { method: 'PUT', endpoint: this.endpoint, id, data, feature: 24 };
  },
  
  async delete(id: string) {
    return { method: 'DELETE', endpoint: this.endpoint, id, feature: 24 };
  },
  
  async batch(operations: any[]) {
    return { method: 'BATCH', operations, feature: 24 };
  }
};
