import {Book} from "./book";
import {Isbn} from "./isbn";
import { BookEntity } from "../persistence/book.entity";

export interface BookRepository{
    save(book: Book): void;
    findOne(isbn: string): Promise<BookEntity>;
    find(): Promise<Book[]>
    findBy(): Promise<Book[]>
    update(book: Book): Promise<Book>;
    delete(isbn: string): void;
}