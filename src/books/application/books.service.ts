import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBookDto } from '../dto/update-book.dto';
import { BookRepositoryTypeORM } from '../persistence/book.repository.typeORM';
import { AddBookDto } from '../dto/add-book.dto';
import { Isbn } from '../domain/isbn';
import { BufferFile } from '../exposition/controller/buffer-file';
import { BookCoverFileSystemRepository } from '../persistence/book-cover.file-system.repository';
import { Book } from '../domain/book';
import { BookCover } from '../domain/book-cover';
import { BookCoverNotFoundException } from './book-cover.not-found.exception';
import { FileLocation } from '../persistence/file-location';

@Injectable()
export class BooksService {
  @Inject()
  private readonly bookRepository: BookRepositoryTypeORM;
  @Inject()
  private readonly bookCoverRepository: BookCoverFileSystemRepository;

  async add(dto: AddBookDto, coverImage: BufferFile): Promise<string> {
    const book: Book = Book.builder()
      .isbn(dto.isbn)
      .title(dto.title)
      .author(dto.author)
      .overview(dto.overview)
      .readCount(dto.readCount)
      .cover(coverImage.buffer as Buffer, coverImage.originalname)
      .build();
    book.cover.location = this.bookCoverRepository.save(book.cover);
    await this.bookRepository.save(book);
    return book.isbn.value;
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  // TODO doit prendre une string
  findOne(isbn: Isbn): Promise<Book> {
    return this.bookRepository.findOne(isbn);
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  async remove(isbn: string) {
    const bookIsbn = new Isbn(isbn);
    const book: Book = await this.bookRepository.findOne(bookIsbn);
    if (!book) {
      throw new NotFoundException();
    }
    // TODO delete the image

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
