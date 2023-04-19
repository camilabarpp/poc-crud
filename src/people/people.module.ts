import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { PersonRepository } from './repository/person.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person, PersonRepository])],
  controllers: [PeopleController],
  providers: [PeopleService, PersonRepository],
})
export class PeopleModule {}
