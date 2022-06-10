import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const newCategory = new Category();
    newCategory.name = name;
    try {
      const dbResponse = await this.categoryRepository.save(newCategory);
      return dbResponse;
    } catch (error) {
      if (error.code == '23505') {
        throw new HttpException(
          'Category already Exists!',
          HttpStatus.CONFLICT,
        );
      }
    }
  }
}
