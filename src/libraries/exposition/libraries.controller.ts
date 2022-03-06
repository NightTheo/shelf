import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { Library } from '../domain/library/library';
import { GetAllLibrariesDto } from '../dto/get-all-libraries.dto';
import { LibrariesService } from '../application/libraries.service';
import { GetAllLibrariesDtoAdapter } from '../adapters/get-all-libraries.dto.adapter';
import { CreateLibraryDto } from '../dto/create-library.dto';
import { UpdateLibraryBooksDto } from '../dto/update-library-books.dto';

@Controller('libraries')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Get()
  async getAllLibraries(): Promise<GetAllLibrariesDto[]> {
    return (await this.librariesService.getAll()).map((library: Library) => {
      const dto: GetAllLibrariesDto = GetAllLibrariesDtoAdapter.adapt(library);
      dto.books.forEach((book) => (book.url = 'url'));
      return dto;
    });
  }

  async createLibrary(dto?: CreateLibraryDto): Promise<void> {
    await this.librariesService.createWithListOfIsbn(dto ? dto.books : []);
  }

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
