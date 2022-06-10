import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';

@Controller()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('/createBook')
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get('/getAllBooksByFilter')
  findAll(@Query() filterData: FilterBookDto) {
    console.log(filterData);
    return this.booksService.findAll(filterData);
  }
}
