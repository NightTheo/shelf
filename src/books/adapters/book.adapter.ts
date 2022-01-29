import {AddBookDto} from "../dto/add-book.dto";
import {Book} from "../domain/book";
import {Isbn} from "../domain/isbn";
import {BookTitle} from "../domain/book-title";
import {Author} from "../domain/author";
import {BookOverview} from "../domain/book-overview";
import {BookEntity} from "../persistence/book.entity";

export class BookAdapter {

    public static fromDto(dto: AddBookDto): Book {
        return Book.builder()
            .isbn(dto.isbn)
            .title(dto.title)
            .author(dto.author)
            .overview(dto.overview)
            .readCount(dto.readCount)
            .build()
    }

    public static fromEntity(entity: BookEntity): Book {
        return Book.builder()
            .isbn(entity.isbn)
            .title(entity.title)
            .author(entity.author)
            .overview(entity.overview)
            .readCount(entity.read_count)
            .build()
    }

}