import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookUseCase } from './application/book.use-case';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  providers: [PrismaService, BookUseCase],
  controllers: [BookController],
})
export class BookModule {}
