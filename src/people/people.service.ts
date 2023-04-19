import { Injectable, NotFoundException } from '@nestjs/common';
import { Person } from './entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly peopleRepository: Repository<Person>,
  ) {}

  async findAll(): Promise<Person[]> {
    return await this.peopleRepository.find();
  }

  async findById(id: number): Promise<Person> {
    try {
      return await this.peopleRepository.findOneOrFail({
        where: {
          id: id,
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Person with ID '${id}' not found`);
      } else {
        throw error;
      }
    }
  }

  async create(person: Person): Promise<Person> {
    return this.peopleRepository.save(person);
  }

  async update(id: number, person: Person): Promise<Person> {
    await this.peopleRepository.update(id, person);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const person: Person = await this.findById(id);
    await this.peopleRepository.remove(person);
  }
}
