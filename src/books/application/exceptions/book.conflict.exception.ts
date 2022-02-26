import { ConflictException } from '@nestjs/common';
import { Isbn } from '../../domain/isbn';

export class BookConflictException extends ConflictException {
  constructor(isbn: Isbn) {
    const message: string = `Conflict with the ISBN [${isbn.value}].`;
    super(isbn, message);
    this.message = message;
  }
}
