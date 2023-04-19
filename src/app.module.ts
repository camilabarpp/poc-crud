import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeopleController } from './people/people.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleService } from './people/people.service';
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
