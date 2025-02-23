import type { Uuid } from "@/types/uuid";

export interface Example {
    id: Uuid;
    name: string;
    description: string;
}