import {BookRepository} from "../domain/book.repository";
import {Isnb} from "../domain/isbn";
import {Book} from "../domain/book";
import {InjectRepository} from "@nestjs/typeorm";
import {BookEntity} from "./book.entity";
import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {BookTitle} from "../domain/book-title";
import {BookOverview} from "../domain/book-overview";
import {Author} from "../domain/author";

@Injectable()
export class BookRepositoryImp implements BookRepository {
    constructor(
        @InjectRepository(BookEntity)
        private booksRepository: Repository<BookEntity>
    ) {
    }

    delete(isbn: Isnb): void {
    }

    async find(): Promise<Book[]> {
        return await this.booksRepository.find()
            .then(books => {
                    return books.map(book => new Book(
                        new Isnb(book.isbn),
                        new BookTitle(book.title),
                        new Author(book.author),
                        new BookOverview(book.overview)
                    ));
                }
            );

    }

    findBy(): Promise<Book[]> {
        return Promise.resolve([]);
    }

    findOne(isbn: Isnb): Promise<Book> {
        return Promise.resolve(undefined);
    }

    async save(book: Book): Promise<Book> {
        return Promise.resolve(undefined);
    }

    update(book: Book): Promise<Book> {
        return Promise.resolve(undefined);
    }

}