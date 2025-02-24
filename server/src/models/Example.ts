import { Example } from '@playground/types/example';
import DataManager from './DataManager';
import { v4 as uuidv4 } from 'uuid';

export default class ExampleModel {
    private dataManager: DataManager;
    private examples: Example[];

    constructor(filename: string) {
        this.dataManager = new DataManager(filename);
        this.examples = this.dataManager.load<Example>();
    }

    getAll(): Example[] {
        return this.examples;
    }

    getById(id: string): Example | null {
        const index = this.examples.findIndex(item => item.id === id);
        return index !== -1 ? this.examples[index] : null;
    }

    add(data: Example): Example {
        data.id = uuidv4();
        this.examples.push(data);
        this.dataManager.save(this.examples);
        return data;
    }

    update(id: string, data: Example): Example | null {
        const index = this.examples.findIndex(item => item.id === id);
        if (index !== -1) {
            this.examples[index] = data;
            this.dataManager.save(this.examples);
            return data;
        }
        return null;
    }

    delete(id: string): boolean {
        const index = this.examples.findIndex(item => item.id === id);
        if (index !== -1) {
            this.examples.splice(index, 1);
            this.dataManager.save(this.examples);
            return true;
        }
        return false;
    }
}

export const examples = new ExampleModel('examples');