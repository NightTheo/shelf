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
import { UpdateLibraryBooksDto } from '../dto/update-library-books.dto';
import { ShelfUrlFactory } from '../../shared/http/shelf-url.factory';
import { GetLibraryDto } from '../dto/get-library.dto';
import { LibraryId } from '../domain/library-id/library-id';

@Controller('libraries')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Get()
  async getAllLibraries(): Promise<GetLibraryDto[]> {
    return (await this.librariesService.getAll()).map((library: Library) => {
      const dto: GetLibraryDto = GetLibraryDtoAdapter.adapt(library);
      return this.getLibraryDtoWithBooksUrlFrom(dto);
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
    const createdId: LibraryId =
      await this.librariesService.createWithListOfIsbn(dto ? dto.books : []);
    return {
      uuid: createdId.value,
      url: librariesUrl + '/' + createdId.value,
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
    @Body() updateLibraryBooksDto: UpdateLibraryBooksDto,
  ): Promise<void> {
    await this.librariesService.update(id, updateLibraryBooksDto.books);
  }
}
