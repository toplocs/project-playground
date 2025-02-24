import fs from 'fs';
import path from 'path';

// TODO: improve DM to hold data in memory, in json or fetch from DB

export default class GenericList<T> {
    private filename: string;
    list: T[] = [];

    constructor(filename: string) {
        this.filename = filename;
        const dataPath = this.getDataPath();
        if (!fs.existsSync(dataPath)) {
            fs.writeFileSync(dataPath, JSON.stringify([]), 'utf8');
        }
        
        this.list = this.load();
    }

    private getDataPath(): string {
        return path.join(__dirname, '..', 'data', `${this.filename}.json`);
    }

    load(): T[] {
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

    save(data: T[]): void {
        const dataPath = this.getDataPath();
        try {
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
        } catch (err) {
            console.error(`Error writing data for ${this.filename}:`, err);
        }
    }
}
