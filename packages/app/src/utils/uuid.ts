import { validate as validateUUID } from "uuid";

export function isUUID(value: string): boolean {
  return validateUUID(value);
}
