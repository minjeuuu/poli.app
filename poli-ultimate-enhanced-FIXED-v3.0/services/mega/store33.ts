class Store33 {
  private state: any = {};
  private listeners: Function[] = [];

  getState() { return { ...this.state }; }
  
  setState(newState: any) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }
  
  subscribe(listener: Function) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  reset() { this.state = {}; }
}

export const store33 = new Store33();
