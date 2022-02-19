import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBookDto } from '../dto/update-book.dto';
import { BookRepositoryImp } from '../persistence/book.repository.imp';
import { AddBookDto } from '../dto/add-book.dto';
import { IsbnFormatException } from '../domain/IsbnFormatException';
import { BookEntity } from '../persistence/book.entity';
import { Isbn } from '../domain/isbn';
import { BufferFile } from '../exposition/controller/buffer-file';
import { BookCoverFileSystemRepository } from '../persistence/book-cover.file-system.repository';
import { Book } from '../domain/book';

@Injectable()
export class BooksService {
  @Inject()
  private readonly bookRepository: BookRepositoryImp;
  private readonly bookCoverRepository: BookCoverFileSystemRepository;

  async add(dto: AddBookDto, coverImage: BufferFile): Promise<string> {
    const book: Book = Book.builder()
      .isbn(dto.isbn)
      .title(dto.title)
      .author(dto.author)
      .overview(dto.overview)
      .readCount(dto.readCount)
      .cover(coverImage)
      .build();
    await this.bookRepository.save(book);
    await this.bookCoverRepository.save(book.cover);
    return book.isbn.value;
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  findOne(isbn: Isbn): Promise<Book> {
    return this.bookRepository.findOne(isbn);
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  async remove(isbn: string) {
    const id = new Isbn(isbn);
    const book: Book = await this.bookRepository.findOne(id);
    if (!book) {
      throw new NotFoundException();
    }

    await this.bookRepository.delete(id);
  }
}
