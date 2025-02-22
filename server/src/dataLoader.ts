import fs from 'fs';
import path from 'path';
import { Example } from '../../types/example';

const exampleDataPath = path.join(__dirname, '..', 'data', 'exampleData.json');

export let exampleData: Example[] = [];

export const loadExampleData = () => {
    fs.readFile(exampleDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return;
        }
        exampleData = JSON.parse(data);
    });
};
