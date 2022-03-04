import { NotFoundException } from '@nestjs/common';
import { Isbn } from '../../domain/isbn/isbn';

export class BookNotFoundException extends NotFoundException {
  constructor(isbn: Isbn) {
    super(isbn, `Book [${isbn.value}] Not Found.`);
  }
}
