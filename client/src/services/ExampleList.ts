/**
 * @fileoverview Managing Example entities in a list
 * @module ExampleList
 */

import type { Uuid } from "@playground/types/uuid";
import { Example } from '@/services/Example';

export class ExampleList {
  examples: Example[] = [];

  async fetchAll(): Promise<Example[]> {
    this.examples = await Example.fetchAll();
    return this.examples;
  }

  async create(newExample: { name: string; description: string }): Promise<Example> {
    const createdExample = await Example.create(newExample);
    console.log("List: ", createdExample);
    this.examples.push(createdExample);
    return createdExample;
  }

  async update(example: Example): Promise<Example> {
    const updatedExample = await Example.update(example.id, example);
    this.replace(updatedExample);
    return updatedExample;
  }

  async replace(example: Example) {
    const index = this.examples.findIndex(e => e.id === example.id);
    if (index !== -1) {
      this.examples[index] = example;
    }
  }

  async delete(id: Uuid): Promise<void> {
    Example.delete(id);
    this.remove(id);
  }

  async remove(id: Uuid) {
    this.examples = this.examples.filter(e => e.id !== id);
  }
}
