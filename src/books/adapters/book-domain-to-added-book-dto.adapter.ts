import {Book} from "../domain/book";
import {AddedBookDto} from "../exposition/dto/added-book.dto";

export class BookDomainToAddedBookDtoAdapter {

    public static of(book: Book): AddedBookDto {
        return {
            isbn: book.isbn.value,
            title: book.title.value,
            author: book.author.name,
            overview: book.overview.value
        }
    }

}
