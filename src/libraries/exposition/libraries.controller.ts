import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Library } from '../domain/library/library';
import { LibrariesService } from '../application/libraries.service';
import { GetLibraryDtoAdapter } from '../adapters/get-library-dto.adapter';
import { CreateLibraryDto } from '../dto/create-library.dto';
import { UpdateLibraryDto } from '../dto/update-library.dto';
import { GetLibraryDto } from '../dto/get-library.dto';
import { LibraryId } from '../domain/library-id/library-id';
import { ShelfUrlFactory } from '../../shared/http/shelf-url.factory';
import { GetAllLibrariesDto } from '../dto/get-all-libraries.dto';
import { GetAllLibrariesDtoAdapter } from '../adapters/get-all-libraries-dto.adapter';

@Controller('libraries')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Get()
  async getAllLibraries(): Promise<GetAllLibrariesDto[]> {
    const librariesApiUrl: string = ShelfUrlFactory.getEndPoint('libraries');
    return (await this.librariesService.getAll()).map((library: Library) => {
      const dto: GetAllLibrariesDto = GetAllLibrariesDtoAdapter.adapt(library);
      dto.url = `${librariesApiUrl}/${library.id.value}`;
      return dto;
    });
  }

  @Get(':uuid')
  async getOneLibrary(@Param('uuid') id: string): Promise<GetLibraryDto> {
    const dto: GetLibraryDto = GetLibraryDtoAdapter.adapt(
      await this.librariesService.getLibraryById(id),
    );
    return this.getLibraryDtoWithBooksUrlFrom(dto);
  }

  private getLibraryDtoWithBooksUrlFrom(dto: GetLibraryDto): GetLibraryDto {
    const booksUrl: string = ShelfUrlFactory.getEndPoint('books');
    const newDto: GetLibraryDto = { ...dto };
    newDto.books.forEach((book) => (book.url = `${booksUrl}/${book.isbn}`));
    return newDto;
  }

  @Post()
  @HttpCode(201)
  async createLibrary(@Body() dto: CreateLibraryDto): Promise<any> {
    const librariesUrl: string = ShelfUrlFactory.getEndPoint('libraries');
    const isbnList: string[] = dto.books ? dto.books : [];
    const createdId: LibraryId =
      await this.librariesService.createWithListOfIsbn(dto.name, isbnList);
    return {
      uuid: createdId?.value,
      url: librariesUrl + '/' + createdId?.value,
    };
  }

  @HttpCode(204)
  @Delete(':uuid')
  async delete(@Param('uuid') libraryId: string): Promise<void> {
    await this.librariesService.delete(libraryId);
  }

  @Patch(':uuid')
  async update(
    @Param('uuid') id: string,
    @Body() updateDto: UpdateLibraryDto,
  ): Promise<void> {
    await this.librariesService.update(id, updateDto.name, updateDto.books);
  }

  @HttpCode(204)
  @Delete('book/:isbn')
  async removeBookFromAllLibraries(@Param('isbn') isbn: string): Promise<void> {
    await this.librariesService.removeBookFromAllLibraries(isbn);
  }
}
