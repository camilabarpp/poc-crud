import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { validate } from 'class-validator';
import { NotFoundException } from '../exception/not-found.exception';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdatePersonDto } from './dto/update-person.dto';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<NonNullable<unknown>>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

describe('PeopleService', () => {
  let service: PeopleService;
  let peopleRepository: Repository<Person>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: getRepositoryToken(Person),
          useValue: repositoryMockFactory(),
        },
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
    peopleRepository = module.get<Repository<Person>>(
      getRepositoryToken(Person),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(peopleRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of people', async () => {
      const result = [
        {
          id: 1,
          name: 'Person 1',
          age: 20,
          email: 'person1@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Person 2',
          age: 30,
          email: 'person2@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Person 3',
          age: 40,
          email: 'person3@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(peopleRepository, 'find').mockResolvedValueOnce(result as any);
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return the correct person by ID', async () => {
      const personId = 1;
      const expectedPerson = { id: 1, name: 'John Doe' };
      jest
        .spyOn(peopleRepository, 'findOne')
        .mockResolvedValueOnce(expectedPerson as any);

      const result = await service.findOne(personId);

      expect(peopleRepository.findOne).toHaveBeenCalledWith({
        where: { id: personId },
      });
      expect(result).toEqual(expectedPerson);
    });

    it('should throw an error when try to find a person with id not found', async () => {
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(1)).rejects.toThrow(
        "Person with ID '1' not found",
      );
    });

    it('should throw an error when ID is not a valid number', async () => {
      const invalidId = 'abc';

      await expect(service.findOne(+invalidId)).rejects.toThrow(
        new BadRequestException("Person with ID 'NaN' not found"),
      );
    });

    it('should throw an error when a database error occurs', async () => {
      const personId = 1;
      jest
        .spyOn(peopleRepository, 'findOne')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findOne(personId)).rejects.toThrow(
        new InternalServerErrorException('Database error'),
      );
    });
  });

  describe('create', () => {
    it('should create a person with success', async () => {
      const personDto = new CreatePersonDto();
      personDto.name = 'John Doe';
      personDto.email = 'johndoe@example.com';
      personDto.age = 30;

      const person = new Person();
      person.name = 'John Doe';
      person.email = 'johndoe@example.com';
      person.age = 30;

      jest.spyOn(peopleRepository, 'save').mockResolvedValueOnce(person as any);

      const result = await service.create(personDto);

      expect(result).toEqual(person);
      expect(peopleRepository.save).toHaveBeenCalledWith(personDto);
    });

    it('should throw an error when try to create a person with name empty', async () => {
      const personDto = new CreatePersonDto();
      personDto.name = '';
      personDto.email = 'camila@mail.com';
      personDto.age = 30;

      const errors = await validate(personDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toMatchObject({
        isNotEmpty: 'Name is required',
      });
    });

    it('should throw an error when try to create a person with email empty', async () => {
      const personDto = new CreatePersonDto();
      personDto.name = 'Camila';
      personDto.email = '';
      personDto.age = 30;

      const errors = await validate(personDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toMatchObject({
        isNotEmpty: 'Email is required',
      });
    });

    it('should throw an error when try to create a person with age empty', async () => {
      const personDto = new CreatePersonDto();
      personDto.name = 'Camila';
      personDto.email = 'camila@mail.com';
      personDto.age = null;

      const errors = await validate(personDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toMatchObject({
        isNotEmpty: 'Age is required',
      });
    });

    it('should thrown an error when try to create a person with email invalid', async () => {
      const personDto = new CreatePersonDto();
      personDto.name = 'Camila';
      personDto.email = 'camila';
      personDto.age = 30;

      const errors = await validate(personDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toMatchObject({
        isEmail: 'email must be an email',
      });
    });
  });

  describe('update', () => {
    it('should update a person', async () => {
      const person = new Person();
      person.id = 1;
      person.name = 'John Doe';
      person.email = 'john@mail.com';
      person.age = 30;

      const personDto = new UpdatePersonDto();
      personDto.name = 'John Smith';
      personDto.email = 'johnsmith@mail.com';
      personDto.age = 33;

      jest
        .spyOn(peopleRepository, 'update')
        .mockResolvedValueOnce(person as any);
      jest
        .spyOn(peopleRepository, 'findOne')
        .mockResolvedValueOnce(person as any);

      const result = await service.update(1, personDto);

      expect(result).toEqual(person);
      expect(peopleRepository.update).toHaveBeenCalledWith(1, personDto);
      expect(peopleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throws NOT_FOUND exception when try to update a person with id not found', async () => {
      const personDto = new UpdatePersonDto();
      personDto.name = 'John Smith';
      personDto.email = 'john@mail.com';
      personDto.age = 33;

      jest.spyOn(peopleRepository, 'findOne').mockResolvedValueOnce(null);

      try {
        await service.update(1, personDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe("Person with ID '1' not found");
      }
    });
  });

  describe('remove', () => {
    it('should remove a person from the database', async () => {
      const person = new Person();
      person.id = 1;
      person.name = 'John Doe';
      person.email = 'john@mail.com';

      jest.spyOn(peopleRepository, 'findOne').mockResolvedValueOnce(person);
      const result = await service.remove(person.id);

      await expect(result).toBeUndefined();
    });

    it('should throws NOT_FOUND exception when try to remove a person with id not found', async () => {
      const findOneSpy = jest
        .spyOn(peopleRepository, 'findOne')
        .mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(1)).rejects.toThrow(
        "Person with ID '1' not found",
      );
      await expect(findOneSpy).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error when a database error occurs while removing a person', async () => {
      const personId = 1;
      const findOneSpy = jest.spyOn(service, 'findOne').mockResolvedValueOnce({
        id: personId,
        name: 'John Smith',
        age: 30,
        email: 'john.smith@example.com',
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      });
      const removeSpy = jest
        .spyOn(peopleRepository, 'remove')
        .mockRejectedValueOnce(new Error());

      await expect(service.remove(personId)).rejects.toThrow(Error);

      expect(findOneSpy).toHaveBeenCalledWith(personId);
      expect(removeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: personId,
          name: 'John Smith',
          age: 30,
          email: 'john.smith@example.com',
        }),
      );
    });
  });
});
