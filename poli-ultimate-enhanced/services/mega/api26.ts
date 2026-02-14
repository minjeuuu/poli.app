export const api26 = {
  endpoint: '/api/v1/feature26',
  
  async get(id?: string) {
    return { method: 'GET', endpoint: this.endpoint, id, feature: 26 };
  },
  
  async post(data: any) {
    return { method: 'POST', endpoint: this.endpoint, data, feature: 26 };
  },
  
  async put(id: string, data: any) {
    return { method: 'PUT', endpoint: this.endpoint, id, data, feature: 26 };
  },
  
  async delete(id: string) {
    return { method: 'DELETE', endpoint: this.endpoint, id, feature: 26 };
  },
  
  async batch(operations: any[]) {
    return { method: 'BATCH', operations, feature: 26 };
  }
};
