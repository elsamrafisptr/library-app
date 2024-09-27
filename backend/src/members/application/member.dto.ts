import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John Marston', type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String })
  phone_number?: string | null;
}

export class UpdateMemberDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(8)
  password: string;

  @ApiProperty({ type: String })
  phone_number: string | null;
}
