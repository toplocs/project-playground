/**
 * @fileoverview Managing Profile API
 * @module Profile
 */

import { GenericService } from '@/utils/genericService';
import { GenericListService } from '@/utils/genericListService';
import type { Profile as ProfileInterface } from '@playground/types/profile';

export class ProfileList extends GenericListService<Profile> {
  constructor() {
      super(Profile);
  }
}

export class Profile extends GenericService<ProfileInterface> {
  static apiRoute = '/api/profile';
  name?: string;
  email?: string;
  userId: string;
    
  constructor(data: ProfileInterface = {
    id: '',
    name: '',
    email: '',
    userId: ''
  }) {
    super(data);
    this.name = data.name || '';
    this.email = data.email || '';    
    this.userId = data.userId || '';
  }
};