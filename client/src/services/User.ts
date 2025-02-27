/**
 * @fileoverview Managing User API
 * @module User
 */

import { GenericService } from '@/utils/genericService';
import type { Uuid } from '@playground/types/uuid';
import type { User as UserInterface } from '@playground/types/user';
import type { Profile } from '@playground/types/profile';

export class User extends GenericService<UserInterface> {
  static apiRoute = '/api/user';
  id: Uuid;
  username: string;
  email?: string;
  profiles?: Profile[];
  createdAt?: Date;
    
  constructor(data: UserInterface = {
    id: '',
    username: '',
    email: ''
  }) {
    super(data);
    this.id = data.id || '';
    this.username = data.username || '';
    this.email = data.email || '';
    this.profiles = data.profiles || [];
    this.createdAt = data.createdAt || new Date();
  }
};
