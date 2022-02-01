import {BookRepository} from "../domain/book.repository";
import {Isbn} from "../domain/isbn";
import {Book} from "../domain/book";
import {InjectRepository} from "@nestjs/typeorm";
import {BookEntity} from "./book.entity";
import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {BookTitle} from "../domain/book-title";
import {BookOverview} from "../domain/book-overview";
import {Author} from "../domain/author";
import {BookAdapter} from "../adapters/book.adapter";

@Injectable()
export class BookRepositoryImp implements BookRepository {
    constructor(
        @InjectRepository(BookEntity)
        private booksRepository: Repository<BookEntity>
    ) {
    }

    delete(isbn: string): void {
    }

    async find(): Promise<Book[]> {
        return (await this.booksRepository.find()).map(book => BookAdapter.fromEntity(book));

    }

    findBy(): Promise<Book[]> {
        return Promise.resolve([]);
    }

    findOne(isbn: string): Promise<BookEntity> {
        return Promise.resolve(undefined);
    }

    async save(book: Book): Promise<void> {
        const bookEntity: BookEntity = {
            author: book.author.name,
            isbn: book.isbn.value,
            overview: book.overview.value,
            title: book.title.value,
            read_count: book.readCount
        }
        await this.booksRepository.save(bookEntity);
    }

    update(book: Book): Promise<Book> {
        return Promise.resolve(undefined);
    }

}