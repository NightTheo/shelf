import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'library' })
export class LibraryEntity {
  @PrimaryColumn({ length: 36 })
  id: string;

  @Column({ nullable: false, default: '[]' })
  books: string;
}
