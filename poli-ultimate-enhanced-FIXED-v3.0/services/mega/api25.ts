export const api25 = {
  endpoint: '/api/v1/feature25',
  
  async get(id?: string) {
    return { method: 'GET', endpoint: this.endpoint, id, feature: 25 };
  },
  
  async post(data: any) {
    return { method: 'POST', endpoint: this.endpoint, data, feature: 25 };
  },
  
  async put(id: string, data: any) {
    return { method: 'PUT', endpoint: this.endpoint, id, data, feature: 25 };
  },
  
  async delete(id: string) {
    return { method: 'DELETE', endpoint: this.endpoint, id, feature: 25 };
  },
  
  async batch(operations: any[]) {
    return { method: 'BATCH', operations, feature: 25 };
  }
};
