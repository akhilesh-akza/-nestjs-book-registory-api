import { Author } from 'src/authors/entities/author.entity';
import { Category } from 'src/categories/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Author)
  @JoinColumn([{ name: 'author', referencedColumnName: 'id' }])
  author: number;

  @ManyToOne(() => Category)
  @JoinColumn([{ name: 'category', referencedColumnName: 'id' }])
  category: number;
}
