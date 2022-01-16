import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity({name:'book'})
export class BookEntity{

  @PrimaryColumn({length: 13})
  isbn: string;

  @Column({length: 200})
  title: string;

  @Column({length: 150})
  author: string;

  @Column({length: 1500})
  overview: string;

}
