import { ConflictException } from '@nestjs/common';
import { Isbn } from '../../../books/domain/isbn/isbn';

export class BookConflictException extends ConflictException {
  constructor(isbn: string) {
    super(isbn, `Conflict with the isbn ${isbn}`);
  }
}
