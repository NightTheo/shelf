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

@Injectable()
export class BooksService {
  constructor(
    private bookRepository: BookRepositoryTypeORM,
    private bookCoverRepository: BookCoverMinioRepository,
  ) {}

  async add(dto: AddBookDto, coverImage: BufferFile) {
    const isbn: Isbn = new Isbn(dto.isbn);
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

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  async remove(isbn: string) {
    const bookIsbn = new Isbn(isbn);
    const coverLocation: FileLocation =
      await this.bookRepository.findCoverLocation(bookIsbn);
    this.bookCoverRepository.delete(coverLocation);
    await this.bookRepository.delete(bookIsbn);
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
