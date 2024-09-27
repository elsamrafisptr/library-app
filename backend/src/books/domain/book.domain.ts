import { ApiProperty } from '@nestjs/swagger';

export class Book {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'WXYZ-123',
  })
  code: string;

  @ApiProperty({
    type: String,
    example: 'Buku Prasejarah',
  })
  title: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor si amet.',
    type: String,
  })
  description: string;

  @ApiProperty({
    example: 'Gua',
    type: String,
  })
  author: string;

  @ApiProperty({
    example: 10,
    type: Number,
  })
  total_stocks: number;

  @ApiProperty({
    example: 10,
    type: Number,
  })
  available_stocks: number;

  @ApiProperty({
    example: 28,
    type: Number,
  })
  history_borrowed_counts: number;

  @ApiProperty({
    example: true,
    type: Boolean,
  })
  is_available: boolean;

  @ApiProperty({
    type: String,
  })
  categoryId: string;
}
