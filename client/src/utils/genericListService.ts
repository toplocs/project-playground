import type { Uuid, GenericObject } from '@playground/types/uuid';
import { GenericService } from '@/utils/genericService';

export class GenericListService<T extends GenericService<GenericObject>> {
  items: T[] = [];

  constructor(private ServiceClass: new () => T) {
  }

  async fetchAll(): Promise<T[]> {
    this.items = await (this.ServiceClass as unknown as typeof GenericService).FetchAll() as T[];
    return this.items;
  }

  async create(data: Partial<T>): Promise<T> {
    const createdItem = await (this.ServiceClass as unknown as typeof GenericService).Create(data) as T;
    this.items.push(createdItem);
    return createdItem;
  }

  async update(item: T): Promise<T> {
    const updatedItem = await (this.ServiceClass as unknown as typeof GenericService).Update(item.id, item) as T;
    this.replace(updatedItem);
    return updatedItem;
  }

  replace(item: T) {
    const index = this.items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.items[index] = item;
    }
  }

  async delete(id: Uuid): Promise<void> {
    await (this.ServiceClass as unknown as typeof GenericService).Delete(id);
    this.remove(id);
  }

  remove(id: Uuid) {
    this.items = this.items.filter(i => i.id !== id);
  }
}
