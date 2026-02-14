export class DatabaseService41 {
  private db = new Map<string, any>();

  async create(key: string, value: any): Promise<any> {
    this.db.set(key, { ...value, id: key, createdAt: Date.now() });
    return this.db.get(key);
  }

  async read(key: string): Promise<any> {
    return this.db.get(key) || null;
  }

  async update(key: string, value: any): Promise<any> {
    const existing = this.db.get(key);
    if (!existing) throw new Error('Not found');
    
    const updated = { ...existing, ...value, updatedAt: Date.now() };
    this.db.set(key, updated);
    return updated;
  }

  async delete(key: string): Promise<boolean> {
    return this.db.delete(key);
  }

  async list(): Promise<any[]> {
    return Array.from(this.db.values());
  }

  async query(predicate: (item: any) => boolean): Promise<any[]> {
    return Array.from(this.db.values()).filter(predicate);
  }

  async count(): Promise<number> {
    return this.db.size;
  }

  async clear(): Promise<void> {
    this.db.clear();
  }
}

export const dbService41 = new DatabaseService41();
