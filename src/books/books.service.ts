import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      const result = await this.bookRepository.save(createBookDto);
      return result;
    } catch (error) {
      if (error.code == '23505') {
        throw new HttpException('Author already Exists!', HttpStatus.CONFLICT);
      }
    }
  }

  // This is so ugly and unsafe to write raw SQL, TypeORM Docs are horrible.

  async findAll({ search, authorId, categoryId }: FilterBookDto) {
    let queryString = `SELECT BOOK.NAME AS Name,
     AUTHOR.NAME AS Author,
      CATEGORY.NAME AS Category,
       BOOK.DESCRIPTION FROM BOOK, AUTHOR, CATEGORY
    WHERE
    BOOK.AUTHOR = author.id
    AND
    BOOK.CATEGORY = category.id`;

    const dbQueryParams = [];

    if (search.length != 0) {
      queryString += ` AND BOOK.NAME ILIKE $${dbQueryParams.length + 1} `;
      dbQueryParams.push(`%${search}%`);
    }
    if (!isNaN(parseInt(authorId)) || authorId.toLowerCase() != 'null') {
      queryString += ` AND BOOK.AUTHOR = $${dbQueryParams.length + 1}`;
      dbQueryParams.push(parseInt(authorId));
    }
    if (!isNaN(parseInt(categoryId)) || categoryId.toLowerCase() != 'null') {
      queryString += ` AND BOOK.CATEGORY = $${dbQueryParams.length + 1}`;
      dbQueryParams.push(parseInt(categoryId));
    }
    queryString += ';';
    console.log(queryString, dbQueryParams);
    const books = await this.bookRepository.query(
      queryString + ';',
      dbQueryParams,
    );

    if (books.length === 0) {
      throw new HttpException('0 books found', HttpStatus.NOT_FOUND);
    } else {
      return books;
    }
  }
}
