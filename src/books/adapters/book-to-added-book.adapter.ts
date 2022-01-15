import {Book} from "../domain/book";
import {AddedBookDto} from "../dto/added-book.dto";

export class BookToAddedBookAdapter {

    public static of(book: Book): AddedBookDto {
        return {
            author: book.author.name,
            isbn: book.isbn.value,
            title: book.title.value
        }
    }

}