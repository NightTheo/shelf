import { IsOptional, ArrayMaxSize } from 'class-validator';

export class CreateLibraryDto {
  @IsOptional()
  @ArrayMaxSize(100)
  books: string[];
}
