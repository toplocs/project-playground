import type { Uuid } from "./uuid";

export interface Example {
    id: Uuid;
    name: string;
    description: string;
}