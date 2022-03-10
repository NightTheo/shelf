import { NotFoundException } from '@nestjs/common';
import { LibraryId } from '../../domain/library-id/library-id';

export class LibraryNotFoundException extends NotFoundException {
  constructor(libraryId: LibraryId) {
    super(libraryId, `Library [${libraryId.value}] Not Found.`);
  }
}
