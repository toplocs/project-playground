import { Uuid } from './uuid';
import { Profile } from './profile';

export interface User {
  id: Uuid;
  username: string;
  email?: string;
  profiles?: Profile[];
  createdAt?: Date;
}
