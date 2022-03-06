import { Injectable } from '@nestjs/common';
import { UpdateBookDto } from '../dto/update-book.dto';
import { BookRepositoryTypeORM } from '../persistence/book.repository.typeORM';
import { AddBookDto } from '../dto/add-book.dto';
import { Isbn } from '../domain/isbn/isbn';
import { BufferFile } from '../../shared/files/buffer-file';
import { Book } from '../domain/book';
import { BookCover } from '../domain/book-cover';
import { BookCoverNotFoundException } from './exceptions/book-cover.not-found.exception';
import { FileLocation } from '../../shared/files/file-location';
import { BookConflictException } from './exceptions/book.conflict.exception';
import { BookNotFoundException } from './exceptions/book.not-found.exception';
import { BookAdapter } from '../adapters/book.adapter';
import { BookCoverMinioRepository } from '../persistence/book-cover.minio.repository';
import { LibraryRepositoryShelfApi } from '../persistence/library.repository.shelf-api';

@Injectable()
export class BooksService {
  constructor(
    private bookRepository: BookRepositoryTypeORM,
    private bookCoverRepository: BookCoverMinioRepository,
    private libraryRepository: LibraryRepositoryShelfApi,
  ) {}

  async add(dto: AddBookDto, coverImage: BufferFile) {
    const isbn: Isbn = new Isbn(dto.isbn);
    const verified = await isbn.verify();

    if (!verified) {
      throw new IsbnFormatException(
        `ISBN do not refer to an existing book. Error with '${isbn.value}'`,
      );
    }

    if (await this.bookRepository.exists(isbn)) {
      throw new BookConflictException(isbn);
    }

    const book: Book = BookAdapter.fromDto(dto);
    book.cover = new BookCover(
      coverImage?.buffer as Buffer,
      new FileLocation(coverImage?.originalname),
    );
    if (book.cover.exists()) {
      book.cover.location = await this.bookCoverRepository.save(book.cover);
    }
    await this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async findOne(isbn: string): Promise<Book> {
    const bookIsbn: Isbn = new Isbn(isbn);
    const book: Book = await this.bookRepository.findOne(bookIsbn);
    if (!book) {
      throw new BookNotFoundException(bookIsbn);
    }
    return book;
  }

  async update(isbn: string, dto: UpdateBookDto, cover: BufferFile) {
    const bookIsbn: Isbn = new Isbn(isbn);
    const found: Book = await this.bookRepository.findOne(bookIsbn);

    if (!found) {
      throw new BookNotFoundException(bookIsbn);
    }

    dto.isbn = isbn;
    const book: Book = BookAdapter.fromDto(dto);

    book.cover = new BookCover(
      cover?.buffer as Buffer,
      new FileLocation(cover?.originalname),
    );

    if (book.cover.exists()) {
      this.bookCoverRepository.delete(found.cover.location);
      book.cover.location = await this.bookCoverRepository.save(book.cover);
    }

    await this.bookRepository.save(book);
  }

  async remove(isbn: string) {
    const bookIsbn = new Isbn(isbn);
    const coverLocation: FileLocation =
      await this.bookRepository.findCoverLocation(bookIsbn);
    this.bookCoverRepository.delete(coverLocation);
    await this.bookRepository.delete(bookIsbn);
    await this.libraryRepository.removeBookFromAllLibraries(bookIsbn);
  }

  async findPictureByIsbn(isbn: string): Promise<BookCover> {
    const BookIsbn: Isbn = new Isbn(isbn);
    const location: FileLocation = await this.bookRepository.findCoverLocation(
      BookIsbn,
    );
    if (!location.exists()) {
      throw new BookCoverNotFoundException(BookIsbn);
    }
    return this.bookCoverRepository.findAt(location);
  }
}
