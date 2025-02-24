/**
 * @fileoverview Managing Example entities in a list
 * @module ExampleList
 */

import { Example } from '@/services/Example';
import { GenericListService } from '@/utils/genericListService';

 export class ExampleList extends GenericListService<Example> {
    constructor() {
        super(Example);
    }
 }

