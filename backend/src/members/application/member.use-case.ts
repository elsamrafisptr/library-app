import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Member } from '../domain/member.domain';
import { CreateMemberDto, UpdateMemberDto } from './member.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class MemberUseCase {
  constructor(private readonly prisma: PrismaService) {}

  // Get all members from the database
  async getAllMembers(): Promise<Member[]> {
    return this.prisma.member.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        email: true,
        phone_number: true,
        membership_date: true,
        current_borrowed_books: true,
        penaltyId: true,
        is_active: true,
      },
    });
  }

  // Get an existing member by member code
  async getMemberById(memberCode: string): Promise<Member> {
    const member = await this.prisma.member.findUnique({
      where: { code: memberCode },
      select: {
        id: true,
        code: true,
        name: true,
        email: true,
        phone_number: true,
        membership_date: true,
        current_borrowed_books: true,
        penaltyId: true,
        is_active: true,
      },
    });

    if (!member) {
      throw new NotFoundException(`Member with code ${memberCode} not found.`);
    }

    return member;
  }

  // Create a new member
  async createMember(createMemberDto: CreateMemberDto): Promise<Member> {
    const existingMember = await this.prisma.member.findUnique({
      where: { email: createMemberDto.email },
    });
    if (existingMember) {
      throw new BadRequestException('Email is already registered.');
    }

    const hashedPassword = await hash(
      createMemberDto.password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    );

    const memberCode = `${createMemberDto.name.slice(0, 2).toUpperCase()}${createMemberDto.email.slice(0, 2).toUpperCase()}-${Math.floor(Math.random() * 900) + 100}`;

    return this.prisma.member.create({
      data: {
        ...createMemberDto,
        code: memberCode,
        password: hashedPassword,
      },
      select: {
        id: true,
        code: true,
        name: true,
        email: true,
        phone_number: true,
        membership_date: true,
        current_borrowed_books: true,
        penaltyId: true,
        is_active: true,
      },
    });
  }

  // Update an existing member by ID
  async updateMember(
    memberId: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found.`);
    }

    return this.prisma.member.update({
      where: { id: memberId },
      data: {
        ...updateMemberDto,
      },
      select: {
        id: true,
        code: true,
        name: true,
        email: true,
        phone_number: true,
        membership_date: true,
        current_borrowed_books: true,
        penaltyId: true,
        is_active: true,
      },
    });
  }

  // Delete a member by ID
  async deleteMember(memberId: string): Promise<{ message: string }> {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found.`);
    }

    await this.prisma.member.delete({
      where: { id: memberId },
    });

    return {
      message: `Member with ID ${memberId} has been successfully deleted.`,
    };
  }
}
