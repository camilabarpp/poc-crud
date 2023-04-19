import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from './people/people.module';
import { Person } from './people/entities/person.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'people',
      entities: [Person],
      synchronize: true,
    }),
    PeopleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
