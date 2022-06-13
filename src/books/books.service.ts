import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from 'src/authors/entities/author.entity';
import { Category } from 'src/categories/entities/category.entity';
import { EntityNotFoundError, QueryBuilder, Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      await this.authorRepository.findOneByOrFail({ id: createBookDto.author });
      await this.categoryRepository.findOneByOrFail({
        id: createBookDto.category,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    try {
      const result = await this.bookRepository.save(createBookDto);
      return result;
    } catch (error) {
      if (error.code == '23505') {
        throw new HttpException('Book already Exists!', HttpStatus.CONFLICT);
      }
    }
  }

  async findAll({ search, authorId, categoryId }: FilterBookDto) {
    const repo = this.bookRepository.createQueryBuilder('book');
    let query = repo
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.category', 'category')
      .select([
        'book.id',
        'book.name',
        'author.name',
        'book.description',
        'category.name',
      ])
      .andWhere('book.name ilike :searchText', { searchText: `%${search}%` });

    if (!isNaN(parseInt(authorId)) || authorId.toLowerCase() != 'null') {
      query = query.andWhere('author.id = :authorId', { authorId });
    }
    if (!isNaN(parseInt(categoryId)) || categoryId.toLowerCase() != 'null') {
      query = query.andWhere('category.id = :categoryId', { categoryId });
    }
    const filteredBooks = await query.getMany();
    if (filteredBooks.length === 0) {
      throw new HttpException('0 books found', HttpStatus.NOT_FOUND);
    }
    return filteredBooks;
  }
}
