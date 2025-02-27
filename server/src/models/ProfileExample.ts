import { ProfileExamples } from '@playground/types/profile';
import DataManager from './DataManager';
import { v4 as uuidv4 } from 'uuid';

export default class ProfileExamplesModel {
    private profileExamples: ProfileExamples[];
    private dataManager: DataManager;

    constructor(filename: string) {
        this.dataManager = new DataManager(filename);
        this.profileExamples = this.dataManager.load<ProfileExamples>();
    }

    getAll(): ProfileExamples[] {
        return this.profileExamples;
    }

    getById(id: string): ProfileExamples | null {
        const index = this.profileExamples.findIndex(item => item.id === id);
        return index !== -1 ? this.profileExamples[index] : null;
    }

    add(data: ProfileExamples): ProfileExamples {
        data.id = uuidv4();
        this.profileExamples.push(data);
        this.dataManager.save(this.profileExamples);
        return data;
    }

    update(id: string, data: ProfileExamples): ProfileExamples | null {
        const index = this.profileExamples.findIndex(item => item.id === id);
        if (index !== -1) {
            this.profileExamples[index] = data;
            this.dataManager.save(this.profileExamples);
            return data;
        }
        return null;
    }

    delete(id: string): boolean {
        const index = this.profileExamples.findIndex(item => item.id === id);
        if (index !== -1) {
            this.profileExamples.splice(index, 1);
            this.dataManager.save(this.profileExamples);
            return true;
        }
        return false;
    }
}

export const profileExamples = new ProfileExamplesModel('profileExamples');