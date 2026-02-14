export const api27 = {
  endpoint: '/api/v1/feature27',
  
  async get(id?: string) {
    return { method: 'GET', endpoint: this.endpoint, id, feature: 27 };
  },
  
  async post(data: any) {
    return { method: 'POST', endpoint: this.endpoint, data, feature: 27 };
  },
  
  async put(id: string, data: any) {
    return { method: 'PUT', endpoint: this.endpoint, id, data, feature: 27 };
  },
  
  async delete(id: string) {
    return { method: 'DELETE', endpoint: this.endpoint, id, feature: 27 };
  },
  
  async batch(operations: any[]) {
    return { method: 'BATCH', operations, feature: 27 };
  }
};
