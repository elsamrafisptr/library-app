import { Test, TestingModule } from '@nestjs/testing';
import { BookUseCase } from './application/book.use-case';
import { BookController } from './book.controller';
import { PrismaService } from '../prisma/prisma.service';
import { Book } from './domain/book.domain';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto, UpdateBookDto } from './application/book.dto';
import { Member } from '@prisma/client';
import { hash } from 'bcryptjs';

describe('BooksController', () => {
  let booksService: BookUseCase;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookUseCase, PrismaService],
    }).compile();

    booksService = moduleRef.get<BookUseCase>(BookUseCase);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('getAllBooks', () => {
    it('should return an array of books', async () => {
      const books: Book[] = [
        {
          id: '1',
          title: 'Book 1',
          author: 'Author 1',
          total_stocks: 10,
          available_stocks: 5,
          code: 'A-B001',
          history_borrowed_counts: 0,
          description: '',
          is_available: false,
          categoryId: '',
        },
      ];
      jest.spyOn(booksService, 'getAllBooks').mockResolvedValue(books);
      const result = await booksService.getAllBooks();
      expect(result).toEqual(books);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBookById', () => {
    it('should return a book if found', async () => {
      const book: Book = {
        id: '1',
        title: 'Book 1',
        author: 'Author 1',
        total_stocks: 10,
        available_stocks: 5,
        code: 'A-B001',
        history_borrowed_counts: 0,
        description: '',
        is_available: false,
        categoryId: '',
      };
      jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(book);

      const result = await booksService.getBookById('1');
      expect(result).toEqual(book);
    });

    it('should throw NotFoundException if book not found', async () => {
      jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(null);

      await expect(booksService.getBookById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createBook', () => {
    it('should create and return a book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        description: '',
        author: 'Author 1',
        total_stocks: 10,
      };
      const createdBook: Book = {
        id: '',
        code: '',
        ...createBookDto,
        available_stocks: createBookDto.total_stocks,
        is_available: true,
        history_borrowed_counts: 0,
        categoryId: null,
      };
      jest.spyOn(prisma.book, 'create').mockResolvedValue(createdBook);

      const result = await booksService.createBook(createBookDto);
      expect(result).toEqual(createdBook);
    });

    it('should throw ConflictException on create error', async () => {
      jest.spyOn(prisma.book, 'create').mockRejectedValue(new Error());

      await expect(
        booksService.createBook({
          title: 'New Book',
          author: 'Author 1',
          total_stocks: 10,
          description: '',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateBook', () => {
    it('should update and return the book', async () => {
      const book: Book = {
        id: '1',
        title: 'Book 1',
        author: 'Author 1',
        total_stocks: 10,
        available_stocks: 5,
        code: 'A-B001',
        history_borrowed_counts: 0,
        description: '',
        is_available: false,
        categoryId: '',
      };
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
      };
      jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(book);
      jest
        .spyOn(prisma.book, 'update')
        .mockResolvedValue({ ...book, ...updateBookDto });

      const result = await booksService.updateBook('1', updateBookDto);
      expect(result).toEqual({ ...book, ...updateBookDto });
    });

    it('should throw NotFoundException if book does not exist', async () => {
      jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(null);

      await expect(
        booksService.updateBook('999', {
          title: 'Updated Book',
          description: '',
          author: '',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book successfully', async () => {
      const book: Book = {
        id: '1',
        title: 'Book 1',
        author: 'Author 1',
        total_stocks: 10,
        available_stocks: 5,
        code: 'A-B001',
        history_borrowed_counts: 0,
        description: '',
        is_available: false,
        categoryId: '',
      };
      jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(book);
      jest.spyOn(prisma.book, 'delete').mockResolvedValue(book);

      const result = await booksService.deleteBook('1');
      expect(result).toEqual({
        message: `Book ${book.title} deleted successfully`,
      });
    });

    it('should throw NotFoundException if book does not exist', async () => {
      jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(null);

      await expect(booksService.deleteBook('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('borrowBook', () => {
    const book: Book = {
      id: '1',
      title: 'Book 1',
      author: 'Author 1',
      total_stocks: 10,
      available_stocks: 5,
      code: 'A-B001',
      history_borrowed_counts: 0,
      description: '',
      is_available: false,
      categoryId: '',
    };

    const member: Member = {
      id: '2',
      code: 'ANAN-284',
      name: 'Angga Firmansyah ',
      email: 'anggafrmnsyh@example.com',
      phone_number: null,
      membership_date: new Date(),
      penaltyId: null,
      current_borrowed_books: 0,
      is_active: true,
      password: hash('rahasia123', 12) as unknown as string,
    };

    it('should borrow book successfully when all conditions are met', async () => {
      // Mock the resolved value for member and book
      jest.spyOn(prisma.member, 'findUnique').mockResolvedValue(member);
      jest.spyOn(prisma.book, 'findUnique').mockResolvedValue(book);

      // Mock the $transaction call and the involved prisma methods
      jest
        .spyOn(prisma, '$transaction')
        .mockImplementation(async (transaction: any) => {
          await transaction[0];
          await transaction[1];
          await transaction[2];
          return;
        });
      const calculateDueDate = (): Date => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        return dueDate;
      };
      jest.spyOn(prisma.loan, 'create').mockResolvedValue({
        id: '1',
        status: 'Active',
        memberId: member.id,
        bookId: book.id,
        borrow_date: new Date(),
        due_date: calculateDueDate(),
        return_date: null,
      });

      jest.spyOn(prisma.book, 'update').mockResolvedValue({
        ...book,
        available_stocks: book.available_stocks - 1,
      });

      jest.spyOn(prisma.member, 'update').mockResolvedValue({
        ...member,
        current_borrowed_books: member.current_borrowed_books + 1,
      });

      const result = await booksService.borrowBook(member.id, book.id);

      expect(result).toEqual({ message: 'Book borrowed successfully' });

      expect(prisma.loan.create).toHaveBeenCalledWith({
        data: {
          status: 'Active',
          memberId: member.id,
          bookId: book.id,
          borrow_date: expect.any(Date),
          due_date: expect.any(Date),
        },
      });

      // Ensure the book.update is called to decrement the available stocks
      expect(prisma.book.update).toHaveBeenCalledWith({
        where: { id: book.id },
        data: {
          available_stocks: { decrement: 1 },
          history_borrowed_counts: { increment: 1 },
        },
      });

      // Ensure the member.update is called to increment the current borrowed books
      expect(prisma.member.update).toHaveBeenCalledWith({
        where: { id: member.id },
        data: {
          current_borrowed_books: { increment: 1 },
        },
      });
    });

    it('should throw NotFoundException if member is not found', async () => {
      jest.spyOn(prisma.member, 'findUnique').mockResolvedValue(null);

      await expect(
        booksService.borrowBook('invalid_member', book.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if member is penalized', async () => {
      jest.spyOn(prisma.member, 'findUnique').mockResolvedValue({
        ...member,
        penaltyId: 'qtjgsuxxvx3z3vw6rvjh97ch',
      });

      await expect(booksService.borrowBook(member.id, book.id)).rejects.toThrow(
        ForbiddenException,
      );

      // Ensure the correct call is made
      expect(prisma.member.findUnique).toHaveBeenCalledWith({
        where: { id: member.id },
        include: { penalty: true },
      });
    });

    it('should throw ForbiddenException if member has already borrowed the maximum books', async () => {
      jest.spyOn(prisma.member, 'findUnique').mockResolvedValue({
        ...member,
        current_borrowed_books: 2,
      });

      await expect(booksService.borrowBook(member.id, book.id)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if book is not available for borrowing', async () => {
      jest.spyOn(prisma.book, 'findUnique').mockResolvedValue({
        ...book,
        available_stocks: 0,
      });

      await expect(booksService.borrowBook(member.id, book.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
