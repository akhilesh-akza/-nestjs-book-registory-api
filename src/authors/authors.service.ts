import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const { name } = createAuthorDto;
    const newAuthor = new Author();
    newAuthor.name = name;
    try {
      const dbResponse = await this.authorRepository.save(newAuthor);
      return dbResponse;
    } catch (error) {
      if (error.code == '23505') {
        throw new HttpException('Author already Exists!', HttpStatus.CONFLICT);
      }
    }
  }
}
