import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { BookUseCase } from './application/book.use-case';
import {
  CreateBookDto,
  UpdateBookDto,
  BookTransactionDto,
} from './application/book.dto';
import { Book } from './domain/book.domain';

@ApiTags('Books')
@Controller({
  path: 'books',
  version: '1',
})
export class BookController {
  constructor(private readonly bookUseCase: BookUseCase) {}

  // Get all books
  @ApiOperation({ summary: 'Get all books' })
  @ApiOkResponse({
    type: [Book],
    description: 'A list of all books',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllBooks() {
    return this.bookUseCase.getAllBooks();
  }

  // Get a specific book by ID
  @ApiOperation({ summary: 'Get a specific book by ID' })
  @ApiOkResponse({
    type: Book,
    description: 'The details of the requested book',
  })
  @ApiNotFoundResponse({
    description: 'Book not found',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBookById(@Param('id') bookId: string) {
    return this.bookUseCase.getBookById(bookId);
  }

  // Create/Register a new book
  @ApiOperation({ summary: 'Create/Register a new book' })
  @ApiCreatedResponse({
    type: Book,
    description: 'The newly created book',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookUseCase.createBook(createBookDto);
  }

  //  Update/Change information of a specific book
  @ApiOperation({ summary: 'Update/Change information of a specific book' })
  @ApiOkResponse({
    type: Book,
    description: 'The updated book details',
  })
  @ApiNotFoundResponse({
    description: 'Book not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateBook(
    @Param('id') bookId: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookUseCase.updateBook(bookId, updateBookDto);
  }

  // Delete a specific book
  @ApiOperation({ summary: 'Delete a specific book' })
  @ApiNoContentResponse({
    description: 'Book deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Book not found',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBook(@Param('id') bookId: string) {
    await this.bookUseCase.deleteBook(bookId);
    return { message: 'Book deleted successfully' };
  }

  // Borrow a book
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiOkResponse({
    description: 'Book borrowed successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid borrow transaction',
  })
  @Post('borrow')
  @HttpCode(HttpStatus.OK)
  async borrowBook(@Body() borrowBookDto: BookTransactionDto) {
    const { member, book } = borrowBookDto;
    if (!member.id || !book.id) {
      throw new Error('Invalid member or book details');
    }

    return this.bookUseCase.borrowBook(member.id, book.id);
  }

  // Return a borrowed book
  @ApiOperation({ summary: 'Return a book' })
  @ApiOkResponse({
    description: 'Book returned successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid return transaction',
  })
  @Post('return')
  @HttpCode(HttpStatus.OK)
  async returnBook(@Body() returnBookDto: BookTransactionDto) {
    const { member, book } = returnBookDto;
    if (!member.id || !book.id) {
      throw new Error('Invalid member or book details');
    }

    return this.bookUseCase.returnBook(member.id, book.id);
  }
}
