import { BookRepository } from '../domain/book.repository';
import { Isbn } from '../domain/isbn';
import { Book } from '../domain/book';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './book.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BookAdapter } from '../adapters/book.adapter';
import { FileLocation } from '../../shared/files/file-location';
import { BookNotFoundException } from '../application/exceptions/book.not-found.exception';
import { UpdateBookDto } from '../dto/update-book.dto';

@Injectable()
export class BookRepositoryTypeORM implements BookRepository {
  constructor(
    @InjectRepository(BookEntity)
    private typeorm: Repository<BookEntity>,
  ) {}

  async delete(isbn: Isbn): Promise<void> {
    const book = new BookEntity();
    book.isbn = isbn.value;
    await this.typeorm.remove(book);
  }

  async find(): Promise<Book[]> {
    return (await this.typeorm.find()).map((book) =>
      BookAdapter.fromEntity(book),
    );
  }

  findBy(): Promise<Book[]> {
    return Promise.resolve([]);
  }

  async findOne(isbn: Isbn): Promise<Book> {
    const book = await this.typeorm.findOne(isbn.value);
    if (!book) {
      return null;
    }
    return Book.builder()
      .isbn(book.isbn)
      .title(book.title)
      .author(book.author)
      .overview(book.overview)
      .readCount(book.read_count)
      .cover({} as Buffer, book.cover_image)
      .build();
  }

  async findCoverLocation(isbn: Isbn): Promise<FileLocation> {
    const book = await this.typeorm.findOne(isbn.value);
    if (!book) {
      throw new BookNotFoundException(isbn);
    }
    return new FileLocation(book.cover_image);
  }

  async save(book: Book): Promise<void> {
    const bookEntity: BookEntity = {
      author: book.author.name,
      isbn: book.isbn.value,
      overview: book.overview.value,
      title: book.title.value,
      read_count: book.readCount,
      cover_image: book.cover.exists() ? book.cover.location.path : null,
    };
    await this.typeorm.save(bookEntity);
  }

  async update(isbn: Isbn, bookDto: UpdateBookDto): Promise<void> {
    const book = await this.typeorm.findOne(isbn.value);

    book.title = bookDto.title;
    book.author = bookDto.author;
    book.overview = bookDto.overview;
    book.read_count = bookDto.read_count;

    await this.typeorm.save(book);
  }

  async exists(isbn: Isbn): Promise<boolean> {
    return (await this.typeorm.findOne(isbn.value)) != null;
  }
}
