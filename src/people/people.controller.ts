import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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
    return this.peopleService.findById(id);
  }

  @Post()
  create(@Body() pessoa: CreatePersonDto) {
    return this.peopleService.create(pessoa);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() pessoa: UpdatePersonDto) {
    return this.peopleService.update(+id, pessoa);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.peopleService.remove(+id);
  }
}
