import { Book } from '../domain/book';
import { GetBookDto } from '../dto/get-book.dto';

export class GetBookDtoAdapter {
  public static from(book: Book): GetBookDto {
    return {
      isbn: book.isbn.value,
      title: book.title.value,
      author: book.author.name,
      overview: book.overview.value,
      readCount: book.readCount,
    };
  }
}
