import { Uuid } from './uuid';
import { Example } from './example';

export const ProfileExampleKeys = ['favorite', 'hidden', 'doing'] as const;

export interface Profile {
  id: Uuid;
  name?: string;
  email?: string;
  userId: string;
  examples?: GroupedExamples;
  createdAt?: Date;
}

export interface ProfileExamples {
  id: Uuid;
  profile_id: Uuid;
  example_id: Uuid;
  key: typeof ProfileExampleKeys[number];
  createdAt?: Date;
}

export type GroupedExamples = {
  [key in typeof ProfileExampleKeys[number]]: Example[];
};
