/**
 * @fileoverview Managing Example API
 * @module Example
 */

import axios from 'axios';
import type { Uuid } from "@/types/uuid";
import type { Example as ExampleInterface } from '@/types/example';

export class Example implements ExampleInterface {
  id: Uuid;
  name: string;
  description: string;

  constructor(data: { id?: Uuid; name?: string; description?: string } = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
  }

  static async fetchAll(): Promise<Example[]> {
    const response = await axios.get<Example[]>('/api/example');
    response.data = response.data.map(example => new Example(example));
    return response.data;
  }

  static async get(id: Uuid): Promise<Example> {
    const response = await axios.get<Example>(`/api/example/${id}`);
    response.data = new Example(response.data);
    return response.data;
  }

  static async create(example: Partial<Example>): Promise<Example> {
    const response = await axios.post<Example>('/api/example', example);
    console.log("Item: ", response);
    return new Example(response.data);
  }

  static async update(id: Uuid, example: Partial<Example>): Promise<Example> {
    const response = await axios.put<Example>(`/api/example/${id}`, example);
    response.data = new Example(response.data);
    return response.data;
  }

  static async delete(id: Uuid): Promise<void> {
    return await axios.delete(`/api/example/${id}`);
  }

  async get(): Promise<Example> {
    const response = await Example.get(this.id);
    Object.assign(this, response);
    return response;
  }

  async create(): Promise<Example> {
    const response = await Example.create(this);
    this.id = response.id;
    return response;
  }

  async update(): Promise<Example> {
    const response = await Example.update(this.id, this);
    return response;
  }

  async delete(): Promise<void> {
    const response = await Example.delete(this.id);
    return response;
  }
}
