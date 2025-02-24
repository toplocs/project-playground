/**
 * @fileoverview Managing Example API
 * @module Example
 */

import axios from 'axios';
import type { Example as ExampleInterface } from '@playground/types/example';
import { GenericService } from '@/utils/genericService';

export class Example extends GenericService<ExampleInterface> {
  static apiRoute = '/api/example';
  name: string;
  description: string;

  constructor(data: ExampleInterface = {
    id: '',
    name: '',
    description: ''
  }) {
    super(data);
    this.name = data.name || '';
    this.description = data.description || '';
  }
};