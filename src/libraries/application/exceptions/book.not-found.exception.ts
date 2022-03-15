import { NotFoundException } from '@nestjs/common';

export class BookNotFoundException extends NotFoundException {
  constructor(isbn: string) {
    super(isbn, `Book [${isbn}] Not Found.`);
  }
}
