export class GetAllLibrariesDto {
  id: string;
  books: { isbn: string; title: string; author: string; url: string }[];
}
