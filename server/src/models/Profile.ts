import { Profile, GroupedExamples, ProfileExampleKeys } from '@playground/types/profile';
import DataManager from './DataManager';
import { examples } from './Example';
import { profileExamples } from './ProfileExample';
import { v4 as uuidv4 } from 'uuid';

export default class ProfileModel {
    private profiles: Profile[];
    private dataManager: DataManager;

    constructor(filename: string) {
        this.dataManager = new DataManager(filename);
        this.profiles = this.dataManager.load<Profile>();
    }
    
    getAll(): Profile[] {
        return this.profiles;
    }
    
    getAllByUserId(userId: string): Profile[] {
        return this.profiles.filter(profile => profile.userId === userId);
    }

    getById(id: string): Profile | null {
        const index = this.profiles.findIndex(item => item.id === id);
        
        if (index !== -1) {
            const relations = profileExamples.getAll().filter(item => item.profile_id === id);
            const groupedExamples: GroupedExamples = ProfileExampleKeys.reduce((acc, key) => {
                acc[key] = [];
                return acc;
            }, {} as GroupedExamples);

            relations.forEach(profileExampleRelation => {
                const exampleDataItem = examples.getById(profileExampleRelation.example_id);
                if (exampleDataItem) {
                    groupedExamples[profileExampleRelation.key].push(exampleDataItem);
                }
            });

            let profile = this.profiles[index]; 
            profile.examples = groupedExamples;
            return profile;
        }
        return null;
    }

    async add(data: Partial<Profile>): Promise<Profile | null> {
        if (!data.userId) {
            return null;
        }

        let profile: Profile = {
            id: data.id || uuidv4(),
            name: data.name,
            email: data.email,
            userId: data.userId,
            createdAt: new Date()
        }
        
        this.profiles.push(profile);
        this.dataManager.save<Profile>(this.profiles);
        console.log('Created profile: ', profile);
        return profile;
    }
}

export const profiles = new ProfileModel('profiles');
