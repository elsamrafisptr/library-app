import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MemberUseCase } from './application/member.use-case';
import { Member } from './domain/member.domain';
import { CreateMemberDto, UpdateMemberDto } from './application/member.dto';
import { hash } from 'bcryptjs';

describe('MemberUseCase Unit Testing', () => {
  let membersService: MemberUseCase;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [MemberUseCase, PrismaService],
    }).compile();

    membersService = moduleRef.get<MemberUseCase>(MemberUseCase);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllMembers', () => {
    it('should return an array of members', async () => {
      const members = [
        {
          id: '1',
          code: 'ANAN-193',
          name: 'Angga Khoirudin',
          email: 'angga@example.com',
          phone_number: null,
          password: '',
          membership_date: new Date(),
          penaltyId: null,
          current_borrowed_books: 2,
          is_active: true,
        },
      ];
      jest.spyOn(prisma.member, 'findMany').mockResolvedValue(members);

      const result = await membersService.getAllMembers();
      expect(result).toEqual(members);
    });
  });

  describe('getMemberById', () => {
    it('should return a member if found', async () => {
      const member = {
        id: '1',
        code: 'ANAN-193',
        name: 'Angga Khoirudin',
        email: 'angga@example.com',
        phone_number: null,
        password: '',
        membership_date: new Date(),
        penaltyId: null,
        current_borrowed_books: 2,
        is_active: true,
      };
      jest.spyOn(prisma.member, 'findUnique').mockResolvedValue(member);

      const result = await membersService.getMemberById('ANAN-193');
      expect(result).toEqual(member);
    });

    it('should throw NotFoundException if member not found', async () => {
      jest.spyOn(prisma.member, 'findUnique').mockResolvedValue(null);

      await expect(
        membersService.getMemberById('invalid-code'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createMember', () => {
    const createMemberDto: CreateMemberDto = {
      email: 'angga@example.com',
      password: 'password123',
      name: 'Angga Khoirudin',
      phone_number: '123456789',
    };
    const createdMember: Member = {
      id: '1',
      code: 'ANAN-193',
      ...createMemberDto,
      phone_number: createMemberDto.phone_number,
      membership_date: new Date(),
      current_borrowed_books: 0,
      penaltyId: null,
      is_active: true,
    };
    it('should create and return a member', async () => {
      jest.spyOn(prisma.member, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.member, 'create').mockResolvedValue({
        ...createdMember,
        password: createMemberDto.password,
      });

      const result = await membersService.createMember(createMemberDto);
      expect(result).toEqual(createdMember);
    });

    it('should throw BadRequestException if email is already registered', async () => {
      jest.spyOn(prisma.member, 'findUnique').mockResolvedValue({
        ...createdMember,
        password: createMemberDto.password,
      });

      await expect(
        membersService.createMember({
          email: 'angga@example.com',
          password: 'password123',
          name: 'Angga Khoirudin',
          phone_number: '123456789',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateMember', () => {
    it('should update and return the member', async () => {
      const member: Member = {
        id: '1',
        code: 'ANAN-193',
        name: 'Angga Khoirudin',
        email: 'angga@example.com',
        phone_number: '123456789',
        membership_date: new Date(),
        penaltyId: null,
        current_borrowed_books: 2,
        is_active: true,
      };

      const updateMemberDto: UpdateMemberDto = {
        email: 'angga.updated@example.com',
        password: 'newpassword123',
        phone_number: '987654321',
      };

      jest.spyOn(prisma.member, 'findUnique').mockResolvedValue({
        ...member,
        password: updateMemberDto.password,
      });
      jest
        .spyOn(prisma.member, 'update')
        .mockResolvedValue({ ...member, ...updateMemberDto });

      const result = await membersService.updateMember('1', updateMemberDto);
      expect(result).toEqual({ ...member, ...updateMemberDto });
    });

    it('should throw NotFoundException if member does not exist', async () => {
      jest.spyOn(prisma.member, 'findUnique').mockResolvedValue(null);

      await expect(
        membersService.updateMember('999', {
          email: 'angga.updated@example.com',
          password: 'newpassword123',
          phone_number: '987654321',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteMember', () => {
    it('should delete a book successfully', async () => {
      const member: Member = {
        id: '1',
        code: 'ANAN-193',
        name: 'Angga Khoirudin',
        email: 'angga@example.com',
        phone_number: null,
        membership_date: new Date(),
        penaltyId: null,
        current_borrowed_books: 2,
        is_active: true,
      };
      jest.spyOn(prisma.member, 'findUnique').mockResolvedValue({
        ...member,
        password: hash('rahasia123', 12) as unknown as string,
      });
      jest.spyOn(prisma.member, 'delete').mockResolvedValue({
        ...member,
        password: hash('rahasia123', 12) as unknown as string,
      });

      const result = await membersService.deleteMember('1');
      expect(result).toEqual({
        message: `Member with ID ${member.id} has been successfully deleted.`,
      });
    });

    it('should throw NotFoundException if book does not exist', async () => {
      jest.spyOn(prisma.member, 'findUnique').mockResolvedValue(null);

      await expect(membersService.deleteMember('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
