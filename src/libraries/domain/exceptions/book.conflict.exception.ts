import { ConflictException } from '@nestjs/common';

export class BookConflictException extends ConflictException {
  constructor(isbn: string) {
    super(isbn, `Conflict with the isbn ${isbn}`);
  }
}
