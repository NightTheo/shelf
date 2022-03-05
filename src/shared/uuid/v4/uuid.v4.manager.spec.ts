import { UuidV4Manager } from './uuid.v4.manager';

describe('UuidV4 Manager', () => {
  it('should create a Uuid V4 Manager', () => {
    const v4: UuidV4Manager = new UuidV4Manager();
  });

  it('should validate a uuid v4', () => {
    const v4: UuidV4Manager = new UuidV4Manager();
    expect(v4.validate('50ce4aa3-6004-47b3-8a42-5813d8bdf286')).toBeTruthy();
  });

  it('should not validate a bad uuid v4', () => {
    const v4: UuidV4Manager = new UuidV4Manager();
    expect(v4.validate('bad Uuid v4')).toBeFalsy();
  });

  it('should not validate a uuid v4 without dashes', () => {
    const v4: UuidV4Manager = new UuidV4Manager();
    expect(v4.validate('6502ff5c2d1c48a089aa323d4b898f62')).toBeFalsy();
  });

  it('should not validate an empty string', () => {
    const v4: UuidV4Manager = new UuidV4Manager();
    expect(v4.validate('')).toBeFalsy();
  });

  it('should not validate null', () => {
    const v4: UuidV4Manager = new UuidV4Manager();
    expect(v4.validate(null)).toBeFalsy();
  });
});
