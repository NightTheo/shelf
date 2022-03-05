import { UuidManager } from '../uuid.manager';
import { UuidV4Manager } from '../v4/uuid.v4.manager';
import { UuidVersionException } from '../uuid-version.exception';

export abstract class UuidManagerFactory {
  static get(version: number): UuidManager {
    switch (version) {
      case 4:
        return new UuidV4Manager();
      default:
        throw new UuidVersionException(`Version ${version} is not handled.`);
    }
  }
}
