import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MemberController } from './member.controller';
import { MemberUseCase } from './application/member.use-case';

@Module({
  imports: [],
  providers: [PrismaService, MemberUseCase],
  controllers: [MemberController],
})
export class MemberModule {}
