import { ConflictException } from '@nestjs/common';
import { Isbn } from '../../../books/domain/isbn/isbn';

export class BookConflictException extends ConflictException {
  constructor(isbn: Isbn) {
    super(isbn, `Conflict with the isbn ${isbn.value}`);
  }
}
