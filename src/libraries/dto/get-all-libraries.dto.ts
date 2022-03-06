export class GetAllLibrariesDto {
  id: string;
  books: { title: string; author: string; url: string }[];
}
