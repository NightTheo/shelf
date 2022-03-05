import { LibraryId } from './library-id';
import { LibraryIdFormatException } from './library-id.format.exception';

describe('LibraryId', () => {
  it('should create a libraryId', () => {
    const id: LibraryId = LibraryId.withValue(
      'd4c8c79e-e990-4b8b-a687-825922f8233b',
    );
    expect(id).not.toBeFalsy();
  });

  it('should throw a LibraryIdFormatException', () => {
    expect(() => LibraryId.withValue('veryBadId')).toThrow(
      LibraryIdFormatException,
    );
  });

  // UUID:universally unique identifier a{8}-b{4}-c{4}-d{4}-e{12}
  it('should generate a libraryId with UUID format', () => {
    const id: LibraryId = new LibraryId();
    expect(id.value).toHaveLength(36);
  });
});
