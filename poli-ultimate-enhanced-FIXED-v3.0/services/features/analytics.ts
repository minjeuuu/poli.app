export class Analytics {
  track(event: string, data?: any) {
    console.log('Analytics:', event, data);
    localStorage.setItem(`analytics_${Date.now()}`, JSON.stringify({ event, data }));
  }
  
  pageView(page: string) {
    this.track('page_view', { page });
  }
  
  userAction(action: string, metadata?: any) {
    this.track('user_action', { action, ...metadata });
  }
  
  getStats() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('analytics_'));
    return keys.map(k => JSON.parse(localStorage.getItem(k) || '{}'));
  }
}
export const analytics = new Analytics();
