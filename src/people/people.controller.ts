import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { Person } from './entities/person.entity';
import { UpdatePersonDto } from './dto/update-person.dto';
import { CreatePersonDto } from './dto/create-person.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('people')
@ApiTags('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @Get()
  @ApiOperation({ summary: 'List all registered people' })
  @ApiResponse({ status: 200, description: 'List all registered people' })
  findAll(): Promise<Person[]> {
    return this.peopleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a person by ID' })
  @ApiResponse({ status: 200, description: 'Find a person by ID' })
  findOne(@Param('id') id: number): Promise<Person> {
    return this.peopleService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new person' })
  @ApiResponse({
    status: 201,
    description: 'Create a new person',
  })
  create(@Body() pessoa: CreatePersonDto): Promise<Person> {
    return this.peopleService.create(pessoa);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a person' })
  @ApiResponse({
    status: 200,
    description: 'Update a person',
  })
  update(
    @Param('id') id: number,
    @Body() pessoa: UpdatePersonDto,
  ): Promise<Person> {
    return this.peopleService.update(+id, pessoa);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a person' })
  @ApiResponse({
    status: 204,
    description: 'Delete a person',
  })
  remove(@Param('id') id: number): Promise<void> {
    return this.peopleService.remove(+id);
  }
}
