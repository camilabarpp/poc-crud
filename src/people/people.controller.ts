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

@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @Get()
  findAll(): Promise<Person[]> {
    return this.peopleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Person> {
    return this.peopleService.findOne(id);
  }

  @Post()
  create(@Body() pessoa: CreatePersonDto): Promise<Person> {
    return this.peopleService.create(pessoa);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() pessoa: UpdatePersonDto,
  ): Promise<Person> {
    return this.peopleService.update(+id, pessoa);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: number): Promise<void> {
    return this.peopleService.remove(+id);
  }
}
