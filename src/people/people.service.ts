import { Injectable } from '@nestjs/common';
import { Person } from './entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    return this.peopleRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async create(person: Person): Promise<Person> {
    return this.peopleRepository.save(person);
  }

  async update(id: number, person: Person): Promise<Person> {
    await this.peopleRepository.update(id, person);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.peopleRepository.delete(id);
  }
}
