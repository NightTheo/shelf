import {Book} from "../domain/book";
import {AddedBookDto} from "../dto/added-book.dto";

export class BookDomainToAddedBookDtoAdapter {

    public static from(book: Book): AddedBookDto {
        return {
            isbn: book.isbn.value,
            title: book.title.value,
            author: book.author.name
        }
    }

}