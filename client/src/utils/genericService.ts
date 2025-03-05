import axios from 'axios';
import type { Uuid, GenericObject } from '@playground/types/uuid';
    
export class GenericService<T extends GenericObject> {
    static apiRoute: string;
    id: Uuid;

    constructor(data: GenericObject = { id: '' }) {
        this.id = data.id || '';
    }

    static async FetchAll<T>(): Promise<T[]> {
        const response = await axios.get<T[]>(`${this.apiRoute}s`);
        response.data = response.data.map(item => new this(item as GenericObject)) as T[];
        return response.data;
    }

    static async Create<T>(data: Partial<T>): Promise<T> {
        const response = await axios.post<T>(`${this.apiRoute}s`, data);
        return new this(response.data as GenericObject) as T;
    }

    static async Get<T>(id: Uuid): Promise<T> {
        const response = await axios.get<T>(`${this.apiRoute}/${id}`);
        response.data = new this(response.data as GenericObject) as T;
        return response.data;
    }

    static async Update<T>(id: Uuid, data: Partial<T>): Promise<T> {
        const response = await axios.put<T>(`${this.apiRoute}/${id}`, data);
        return new this(response.data as GenericObject) as T;
    }

    static async Delete(id: Uuid): Promise<void> {
        await axios.delete(`${this.apiRoute}/${id}`);
    }

    async get(): Promise<T> {
        const response = await (this.constructor as typeof GenericService).Get(this.id);
        Object.assign(this, response);
        return response as unknown as T;
    }

    async create(): Promise<T> {
        const response = await (this.constructor as typeof GenericService).Create(this);
        this.id = response.id;
        return response as unknown as T;
    }

    async update(): Promise<T> {
        const response = await (this.constructor as typeof GenericService).Update(this.id, this);
        return response as unknown as T;
    }

    async delete(): Promise<void> {
        await (this.constructor as typeof GenericService).Delete(this.id);
    }
}
