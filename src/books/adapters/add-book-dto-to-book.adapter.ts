import {AddBookDto} from "../exposition/dto/add-book.dto";
import {Book} from "../domain/book";
import {Isnb} from "../domain/isbn";
import {BookTitle} from "../domain/book-title";
import {Author} from "../domain/author";
import {BookOverview} from "../domain/book-overview";

export class AddBookDtoToBookAdapter {

    public static from(dto: AddBookDto): Book {
        return new Book(
            new Isnb(dto.isbn),
            new BookTitle(dto.title),
            new Author(dto.author),
            new BookOverview(dto.overview)
        );
    }

}