export class RealtimeService48 {
  private ws: WebSocket | null = null;
  private listeners: Function[] = [];

  connect(url: string = 'wss://api.poli.app') {
    this.ws = new WebSocket(url);
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.listeners.forEach(fn => fn(data));
    };
  }

  subscribe(callback: Function) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(fn => fn !== callback);
    };
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    this.ws?.close();
  }
}

export const realtimeService48 = new RealtimeService48();
