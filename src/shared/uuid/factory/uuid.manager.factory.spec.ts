import { UuidManagerFactory } from './uuid.manager.factory';
import { UuidV4Manager } from '../v4/uuid.v4.manager';
import { UuidVersionException } from '../uuid-version.exception';

describe('Uuid Manager Factory', () => {
  it('should create a uuid manager v4', () => {
    expect(UuidManagerFactory.get(4)).toBeInstanceOf(UuidV4Manager);
  });

  it('should throw a UuidVersionException', () => {
    expect(() => UuidManagerFactory.get(0)).toThrow(UuidVersionException);
  });
});
