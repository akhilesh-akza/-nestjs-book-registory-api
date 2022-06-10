import { IsNotEmpty, IsString } from 'class-validator';

export class FilterBookDto {
  @IsString()
  search: string;

  @IsNotEmpty()
  @IsString()
  authorId: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
