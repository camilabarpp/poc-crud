import { Injectable } from '@nestjs/common';
import { Person } from './entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { NotFoundException } from '../exception/not-found.exception';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly peopleRepository: Repository<Person>,
  ) {}

  async findAll(): Promise<Person[]> {
    return await this.peopleRepository.find();
  }

  async findOne(id: number): Promise<Person> {
    const person: Person = await this.peopleRepository.findOne({
      where: { id: id },
    });
    if (!person) {
      throw new NotFoundException(`Person with ID '${id}' not found`);
    }
    return person;
  }

  async create(personDto: CreatePersonDto): Promise<Person> {
    return this.peopleRepository.save(personDto);
  }

  async update(id: number, person: UpdatePersonDto): Promise<Person> {
    await this.peopleRepository.update(id, {
      ...(person.name && { name: person.name }),
      ...(person.age && { age: person.age }),
      ...(person.email && { email: person.email }),
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const person: Person = await this.findOne(id);
    await this.peopleRepository.remove(person);
  }
}
