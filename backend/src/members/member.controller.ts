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
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { MemberUseCase } from './application/member.use-case';
import { Member } from './domain/member.domain';
import { CreateMemberDto, UpdateMemberDto } from './application/member.dto';

@ApiTags('Member')
@Controller({
  path: 'members',
  version: '1',
})
export class MemberController {
  constructor(private readonly memberUseCase: MemberUseCase) {}

  // Get all members
  @ApiOperation({ summary: 'Get all members' })
  @ApiOkResponse({
    type: [Member],
    description: 'A list of all members',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllMembers() {
    return this.memberUseCase.getAllMembers();
  }

  // Get a specific member by member code
  @ApiOperation({ summary: 'Get a specific member by ID' })
  @ApiOkResponse({
    type: Member,
    description: 'The details of the requested member',
  })
  @ApiNotFoundResponse({
    description: 'Member not found',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getMemberById(@Param('id') memberId: string) {
    return this.memberUseCase.getMemberById(memberId);
  }

  // Create a new member
  @ApiOperation({ summary: 'Create/Register a new member' })
  @ApiCreatedResponse({
    type: Member,
    description: 'The newly created member',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMember(@Body() createMemberDto: CreateMemberDto) {
    return this.memberUseCase.createMember(createMemberDto);
  }

  // Update an existing member
  @ApiOperation({ summary: 'Update/Change information of a specific member' })
  @ApiOkResponse({
    type: Member,
    description: 'The updated member details',
  })
  @ApiNotFoundResponse({
    description: 'Member not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateMember(
    @Param('id') memberId: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.memberUseCase.updateMember(memberId, updateMemberDto);
  }

  // Delete a member by ID
  @ApiOperation({ summary: 'Delete a specific member' })
  @ApiNoContentResponse({
    description: 'Member deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Member not found',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMember(@Param('id') memberId: string) {
    await this.memberUseCase.deleteMember(memberId);
    return { message: 'Member deleted successfully' };
  }
}
