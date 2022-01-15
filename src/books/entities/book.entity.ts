import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity({name:'book'})
export class BookEntity{

  @PrimaryColumn()
  isbn: string;

  @Column()
  title: string;

  @Column()
  author: string;

}
