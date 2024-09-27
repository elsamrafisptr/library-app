import { ApiProperty } from '@nestjs/swagger';

export class Member {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'WXYZ-123',
  })
  code: string;

  @ApiProperty({ example: 'test1@example.com', type: String })
  email: string | null;

  @ApiProperty({ example: 'John Marston', type: String })
  name: string;

  password?: string;

  @ApiProperty({ type: String })
  phone_number: string | null;

  @ApiProperty({ type: Date })
  membership_date: Date;

  @ApiProperty({ type: String })
  penaltyId: string | null;

  @ApiProperty({ default: 0, type: Number })
  current_borrowed_books: number | null;

  @ApiProperty({ default: true, type: Boolean })
  is_active: boolean;
}
