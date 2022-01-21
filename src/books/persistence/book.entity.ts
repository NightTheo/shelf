import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity({name:'book'})
export class BookEntity{

  @PrimaryColumn({length: 13, nullable: false})
  isbn: string;

  @Column({length: 200, nullable: false})
  title: string;

  @Column({length: 150, nullable: false})
  author: string;

  @Column({length: 1500, nullable: true})
  overview: string;

}
