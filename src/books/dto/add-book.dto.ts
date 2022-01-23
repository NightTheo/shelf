import {IsNotEmpty, MaxLength} from "class-validator";
import {UseFilters} from "@nestjs/common";

export class AddBookDto {
    @IsNotEmpty()
    @MaxLength(17)
    isbn: string;

    @IsNotEmpty()
    @MaxLength(200)
    title: string;

    @IsNotEmpty()
    @MaxLength(150)
    author: string;

    @MaxLength(1500)
    overview: string;
}
