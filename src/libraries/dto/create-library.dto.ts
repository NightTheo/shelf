import {
  IsOptional,
  ArrayMaxSize,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateLibraryDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @ArrayMaxSize(100)
  books: string[];
}
