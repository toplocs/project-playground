import DataManager from './DataManager';
import { User } from '@playground/types/user';
import { v4 as uuidv4 } from 'uuid';
import { profiles } from './Profile';

export default class UserModel {
    private dataManager: DataManager;
    private users: User[];

    constructor(filename: string) {
        this.dataManager = new DataManager(filename);
        this.users = this.dataManager.load<User>();
    }

    async getById(id: string) {
        const index = this.users.findIndex(item => item.id === id);
        return index !== -1 ? this.users[index] : null;
    }

    async getByIdWithProfiles(id: string) {
        const user = await this.getById(id);
        console.log('User: ', user);
        if (!user) {
            return null;
        }

        user.profiles = await profiles.getAllByUserId(user.id);
        return user;
    }


    async getByUsername(username: string) {
        const index = this.users.findIndex(item => item.username === username);
        return index !== -1 ? this.users[index] : null;
    }

    async add(data: Partial<User>): Promise<User | null> {
        if (!data.username) {
            return null;
        }

        let user: User = {
            id: data.id || uuidv4(),
            username: data.username,
            email: data.email,
            profiles: [],
            createdAt: new Date()
        }
        
        this.users.push(user);
        this.dataManager.save<User>(this.users);
        console.log('Created user: ', user);
        return user;
    }
}

export const users = new UserModel('users');