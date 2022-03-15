import { UuidManager } from '../../../shared/uuid/uuid.manager';
import { UuidManagerFactory } from '../../../shared/uuid/factory/uuid.manager.factory';
import { LibraryIdFormatException } from './library-id.format.exception';

export class LibraryId {
  private readonly _value: string;
  private readonly manager: UuidManager = UuidManagerFactory.get(
    +process.env.UUID_VERSION || 4,
  );

  constructor(value?: string) {
    this._value = value ? value : this.manager.generate();
  }

  get value(): string {
    return this._value;
  }

  static withValue(value: string): LibraryId {
    const version: number = +process.env.UUID_VERSION || 4;
    const validator: UuidManager = UuidManagerFactory.get(version);
    if (!validator.validate(value)) {
      throw new LibraryIdFormatException(`Library Id is a UUID-v${version}.`);
    }
    return new LibraryId(value);
  }
}
