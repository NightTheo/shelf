import { BookRepository } from '../domain/book.repository';
import { Isbn } from '../domain/isbn';
import { Book } from '../domain/book';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './book.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BookAdapter } from '../adapters/book.adapter';
import { BufferFile } from '../exposition/controller/buffer-file';

@Injectable()
export class BookRepositoryImp implements BookRepository {
  constructor(
    @InjectRepository(BookEntity)
    private booksRepository: Repository<BookEntity>,
  ) {}

  async delete(isbn: Isbn): Promise<void> {
    const book = new BookEntity();
    book.isbn = isbn.value;
    await this.booksRepository.remove(book);
  }

  async find(): Promise<Book[]> {
    return (await this.booksRepository.find()).map((book) =>
      BookAdapter.fromEntity(book),
    );
  }

  findBy(): Promise<Book[]> {
    return Promise.resolve([]);
  }

  async findOne(isbn: Isbn): Promise<Book> {
    const book = await this.booksRepository.findOne(isbn.value);
    if (!book) {
      return null;
    }
    return Book.builder()
      .isbn(book.isbn)
      .title(book.title)
      .author(book.author)
      .overview(book.overview)
      .readCount(book.read_count)
      .cover(
        book.cover_image
          ? ({ filename: book.cover_image } as BufferFile)
          : null,
      )
      .build();
  }

  async save(book: Book): Promise<void> {
    const bookEntity: BookEntity = {
      author: book.author.name,
      isbn: book.isbn.value,
      overview: book.overview.value,
      title: book.title.value,
      read_count: book.readCount,
      cover_image: book.cover.file.filename,
    };
    await this.booksRepository.save(bookEntity);
  }

  update(book: Book): Promise<Book> {
    return Promise.resolve(undefined);
  }
}
