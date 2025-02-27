import fs from 'fs';
import path from 'path';

// TODO: improve DM to hold data in memory, in json or fetch from DB

class DataManager {
    private filename: string;

    constructor(filename: string) {
        this.filename = filename;
        const dataPath = this.getDataPath();
        if (!fs.existsSync(dataPath)) {
            fs.writeFileSync(dataPath, JSON.stringify([]), 'utf8');
        }
    }

    private getDataPath(): string {
        return path.join(__dirname, '..', '..', 'data', `${this.filename}.json`);
    }

    load<T>(): T[] {
        const dataPath = this.getDataPath();
        let data: T[] = [];
        try {
            const fileContent = fs.readFileSync(dataPath, 'utf8');
            data = JSON.parse(fileContent);
        } catch (err) {
            console.error(`Error reading data for ${this.filename}:`, err);
        }
        return data;
    }

    save<T>(data: T[]): void {
        const dataPath = this.getDataPath();
        try {
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
        } catch (err) {
            console.error(`Error writing data for ${this.filename}:`, err);
        }
    }

    add<T>(newData: T): T | null {
        const data = this.load<T>();
        data.push(newData);
        this.save<T>(data);
        return newData;
    }

    getById<T>(id: string): T | null {
        const data = this.load<T>();
        const item = data.find((item: any) => item.id === id);
        return item || null;
    }

    update<T>(id: string, newData: Partial<T>): T | null {
        const data = this.load<T>();
        const index = data.findIndex((item: any) => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...newData };
            this.save<T>(data);
            return data[index]; 
        }
        return null;
    }

    delete<T>(id: string): boolean {
        const data = this.load<T>();
        const index = data.findIndex((item: any) => item.id === id);
        if (index !== -1) {
            data.splice(index, 1);
            this.save<T>(data);
            return true;
        }
        return false;
    }
}

export default DataManager;
