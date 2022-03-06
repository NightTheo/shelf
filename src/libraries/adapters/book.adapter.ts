import { GetBookDto } from '../dto/get-book.dto';
import { Book } from '../domain/book/book';

export class BookAdapter {
  static fromDto(dto: GetBookDto) {
    return new Book(dto.isbn, dto.title, dto.author);
  }
}
