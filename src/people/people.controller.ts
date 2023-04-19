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

@Controller('people')
export class PeopleController {
  constructor(private pessoasService: PeopleService) {}

  @Get()
  findAll() {
    return this.pessoasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pessoasService.findById(id);
  }

  @Post()
  create(@Body() pessoa) {
    return this.pessoasService.create(pessoa);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() pessoa) {
    return this.pessoasService.update(id, pessoa);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.pessoasService.remove(id);
  }
}
