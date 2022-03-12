import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdateLibraryDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @ArrayMaxSize(100)
  books?: string[];
}
