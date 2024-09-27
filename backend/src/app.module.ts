import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { BookModule } from './books/book.module';
import { MemberModule } from './members/member.module';

@Module({
  imports: [CommonModule, BookModule, MemberModule],
})
export class AppModule {}
