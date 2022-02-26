import { NotFoundException } from '@nestjs/common';
import { Isbn } from '../../domain/isbn';

export class BookCoverNotFoundException extends NotFoundException {
  constructor(isbn: Isbn) {
    super(isbn, `Cover of the book [${isbn.value}] Not Found.`);
  }
}
