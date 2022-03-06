import { AddBookDto } from '../dto/add-book.dto';
import { Book } from '../domain/book';
import { BookEntity } from '../persistence/book.entity';
import { UpdateBookDto } from '../dto/update-book.dto';

export class BookAdapter {
  public static fromDto(dto: AddBookDto | UpdateBookDto): Book {
    return Book.builder()
      .isbn(dto.isbn)
      .title(dto.title)
      .author(dto.author)
      .overview(dto.overview)
      .readCount(dto.read_count)
      .build();
  }

  public static fromEntity(entity: BookEntity): Book {
    return Book.builder()
      .isbn(entity.isbn)
      .title(entity.title)
      .author(entity.author)
      .overview(entity.overview)
      .readCount(entity.read_count)
      .build();
  }
}
