import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { CreateBookDto, UpdateBookDto } from './book.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Book } from '../domain/book.domain';

@Injectable()
export class BookUseCase {
  constructor(private readonly prisma: PrismaService) {}

  // Get all books
  async getAllBooks(): Promise<Book[]> {
    return await this.prisma.book.findMany();
  }

  // Get a single book by code
  async getBookById(bookCode: string): Promise<Book> {
    const book = await this.prisma.book.findUnique({
      where: { code: bookCode },
    });

    if (!book) {
      throw new NotFoundException(`Book with code ${bookCode} not found`);
    }
    return book;
  }

  // Create a new book
  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const { author, title, total_stocks } = createBookDto;

    const generatedCode = this.generateBookCode(author, title);
    try {
      const newBook = await this.prisma.book.create({
        data: {
          ...createBookDto,
          code: generatedCode,
          available_stocks: total_stocks,
        },
      });
      return newBook;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new ConflictException('Error creating the book. Please try again.');
    }
  }

  // Update an existing book
  async updateBook(
    bookId: string,
    updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found`);
    }

    return await this.prisma.book.update({
      where: { id: bookId },
      data: updateBookDto,
    });
  }

  // Delete a book
  async deleteBook(bookId: string): Promise<{ message: string }> {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found`);
    }

    await this.prisma.book.delete({
      where: { id: bookId },
    });

    return { message: `Book ${book.title} deleted successfully` };
  }

  // Borrow a book
  async borrowBook(
    memberId: string,
    bookId: string,
  ): Promise<{ message: string }> {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: { penalty: true },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (member.penalty?.status === true) {
      throw new ForbiddenException('Member is currently penalized.');
    }

    if (member.current_borrowed_books >= 2) {
      throw new ForbiddenException(
        'Member has already borrowed the maximum books.',
      );
    }

    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book || book.available_stocks <= 0) {
      throw new NotFoundException('Book is not available for borrowing.');
    }

    await this.prisma.$transaction([
      this.prisma.loan.create({
        data: {
          status: 'Active',
          memberId: memberId,
          bookId: book.id,
          borrow_date: new Date(),
          due_date: this.calculateDueDate(),
        },
      }),
      this.prisma.book.update({
        where: { id: book.id },
        data: {
          available_stocks: { decrement: 1 },
          history_borrowed_counts: { increment: 1 },
        },
      }),
      this.prisma.member.update({
        where: { id: memberId },
        data: { current_borrowed_books: { increment: 1 } },
      }),
    ]);

    return { message: 'Book borrowed successfully' };
  }

  // Return a book
  async returnBook(
    memberId: string,
    bookId: string,
  ): Promise<{ message: string }> {
    const loan = await this.prisma.loan.findFirst({
      where: {
        memberId: memberId,
        bookId: bookId,
        status: 'Active',
      },
    });

    if (!loan) {
      throw new NotFoundException('No active loan found for this book.');
    }

    const overdue = this.checkOverdue(loan.borrow_date);
    if (overdue) {
      const penalty = await this.prisma.penalty.create({
        data: {
          memberId: memberId,
          start_date: new Date(),
          end_date: this.calculatePenaltyEndDate(),
          status: true,
          reason: 'Overdue book return',
        },
      });

      await this.prisma.member.update({
        where: { id: memberId },
        data: { penaltyId: penalty.id },
      });
    }

    // Update loan and Book stock in a transaction
    await this.prisma.$transaction([
      this.prisma.loan.update({
        where: { id: loan.id },
        data: { status: 'Returned', return_date: new Date() },
      }),
      this.prisma.book.update({
        where: { id: bookId },
        data: { available_stocks: { increment: 1 } },
      }),
      this.prisma.member.update({
        where: { id: memberId },
        data: { current_borrowed_books: { decrement: 1 } },
      }),
    ]);

    return { message: 'Book returned successfully' };
  }

  private generateBookCode(author: string, title: string): string {
    return (
      author[0] +
      title.substring(0, 3).toUpperCase() +
      '-' +
      (Math.floor(Math.random() * 1000) + 100)
    );
  }

  private checkOverdue(borrowedAt: Date): boolean {
    const now = new Date();
    const diff = (now.getTime() - borrowedAt.getTime()) / (1000 * 3600 * 24);
    return diff > 7;
  }

  private calculateDueDate(): Date {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    return dueDate;
  }

  private calculatePenaltyEndDate(): Date {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);
    return endDate;
  }
}
