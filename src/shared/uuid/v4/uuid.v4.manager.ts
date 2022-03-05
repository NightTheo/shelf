import { UuidManager } from '../uuid.manager';
import { v4 as uuid4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';

export class UuidV4Manager implements UuidManager {
  generate(): string {
    return uuid4();
  }

  validate(uuid: string): boolean {
    return uuidValidate(uuid);
  }
}
