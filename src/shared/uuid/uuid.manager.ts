export interface UuidManager {
  generate(): string;
  validate(uuid: string): boolean;
}
