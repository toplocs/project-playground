import DataManager from './DataManager';
import { Passkey } from '@playground/types/credential';
import { v4 as uuidv4 } from 'uuid';
import { Uuid } from '@playground/types/uuid';
import { 
    WebAuthnCredential,
    AuthenticatorTransportFuture,
    CredentialDeviceType, 
    Base64URLString
} from '@simplewebauthn/server';


export class Credential implements Passkey {
    id!: Base64URLString;
    publicKey!: Base64URLString;
    userId!: Uuid;
    webauthnUserID!: Base64URLString;
    counter!: number;
    deviceType!: CredentialDeviceType;
    backedUp!: boolean;
    transports?: AuthenticatorTransportFuture[];

    constructor(credential: Passkey) {
        Object.assign(this, credential);
    }

    static uint8ArrayToBase64 = (uint8Array: Uint8Array): string =>
        Buffer.from(uint8Array).toString('base64');
    
    static base64ToUint8Array = (base64: string): Uint8Array =>
        new Uint8Array(Buffer.from(base64, 'base64'));
    
    publicKeyUint8(): Uint8Array {
        return Credential.base64ToUint8Array(this.publicKey);
    }
}

export default class CredentialModel {
    private dataManager: DataManager;

    constructor(filename: string) {
        this.dataManager = new DataManager(filename);
    }

    async add(data: Credential): Promise<Credential | null> {
        this.dataManager.add(data);
        return data;
    }

    async getById(id: string): Promise<Credential | null> {
        return this.dataManager.getById<Credential>(id);
    }

    async getAllByUserId(userId: string): Promise<Credential[]> {
        const credentials = this.dataManager.load<Credential>();
        return credentials.filter(item => item.userId === userId);
    }

    async updateCounter(id: string, counter: number): Promise<Credential | null> {
        return this.dataManager.update<Credential>(id, { counter: counter });
    }

    delete(id: string): boolean {
        return this.dataManager.delete(id);
    }
}

export const credentials = new CredentialModel('credentials');
