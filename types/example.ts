import type { Uuid, GenericObject } from "./uuid";

export interface Example extends GenericObject {
    id?: Uuid;
    name?: string;
    description?: string;
}