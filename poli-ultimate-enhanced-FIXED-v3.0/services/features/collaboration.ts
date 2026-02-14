export class Collaboration {
  comments: any[] = [];
  
  addComment(itemId: string, text: string, author: string) {
    const comment = { id: Date.now(), itemId, text, author, timestamp: new Date() };
    this.comments.push(comment);
    return comment;
  }
  
  getComments(itemId: string) {
    return this.comments.filter(c => c.itemId === itemId);
  }
  
  shareWithUser(itemId: string, userId: string) {
    console.log('Shared', itemId, 'with', userId);
  }
}
export const collaboration = new Collaboration();
