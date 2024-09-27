import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

import { Book } from '../domain/book.domain';
import { Member } from '../../members/domain/member.domain';

export class CreateBookDto {
  @ApiProperty({
    example: 'Buku Prasejarah',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor si amet.',
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Gua',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    example: 10,
    type: Number,
  })
  @IsInt()
  total_stocks: number;
}

export class UpdateBookDto {
  @ApiProperty({
    example: 'Buku Prasejarah',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor si amet.',
    type: String,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Gua',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  author?: string;
}

export class BookTransactionDto {
  @ApiProperty({
    type: Member,
  })
  @IsNotEmpty()
  member: Member;

  @ApiProperty({
    type: Book,
  })
  @IsNotEmpty()
  book: Book;
}
