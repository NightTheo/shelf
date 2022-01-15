import {Book} from "./book";
import {Isnb} from "./isbn";

export interface BookRepository{
    save(book: Book): Promise<Book>;
    findOne(isbn: Isnb): Promise<Book>;
    find(): Promise<Book[]>
    findBy(): Promise<Book[]>
    update(book: Book): Promise<Book>;
    delete(isbn: Isnb): void;
}