import { Test, TestingModule } from '@nestjs/testing';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { Person } from './entities/person.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

const personStub1 = {
  id: 1,
  name: 'Person 1',
  age: 20,
  email: 'person1@example.com',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
};

const personStub2 = {
  id: 2,
  name: 'Person 1',
  age: 20,
  email: 'person1@example.com',
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
};
describe('PeopleController', () => {
  let controller: PeopleController;
  let service: PeopleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
      providers: [
        PeopleService,
        {
          provide: getRepositoryToken(Person),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PeopleController>(PeopleController);
    service = module.get<PeopleService>(PeopleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of people', async () => {
      const result = [personStub1, personStub2];

      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.findAll()).toBe(result);
    });

    it('should return an empty array when there are no people registered', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a person by ID', async () => {
      const person = personStub1;

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(person);

      expect(await controller.findOne(1)).toBe(person);
    });

    it('should return null when person does not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

      expect(await controller.findOne(999)).toBeNull();
    });

    it('should throw an exception when an invalid ID is provided', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new Error());

      await expect(controller.findOne(+'invalid')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new person', async () => {
      const newPerson: CreatePersonDto = personStub1;
      const createdPerson: Person = {
        id: 1,
        name: newPerson.name,
        age: newPerson.age,
        email: newPerson.email,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce(createdPerson);

      const result = await controller.create(newPerson);

      expect(result).toEqual(createdPerson);
    });

    it('should throw an error if name is missing', async () => {
      const newPerson: CreatePersonDto = personStub1;

      await expect(controller.create(newPerson)).rejects.toThrowError();
    });

    it('should throw an error if age is missing', async () => {
      const newPerson: CreatePersonDto = personStub1;

      await expect(controller.create(newPerson)).rejects.toThrowError();
    });

    it('should throw an error if email is missing', async () => {
      const newPerson: CreatePersonDto = personStub1;

      await expect(controller.create(newPerson)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update the person with the given id and return it', async () => {
      const personToUpdate = personStub1;

      const updateDto: UpdatePersonDto = {
        name: 'Updated Name',
        age: 30,
        email: 'updated@example.com',
      };
      const updatedPerson = {
        ...personToUpdate,
        ...updateDto,
        updatedAt: expect.any(String), // mock the updated timestamp
      };

      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedPerson);

      const result = await controller.update(personToUpdate.id, updateDto);

      expect(service.update).toHaveBeenCalledWith(personToUpdate.id, updateDto);
      expect(result).toEqual(updatedPerson);
    });

    it('should throw an error if the person with the given id is not found', async () => {
      const nonExistentId = 123;
      const updateDto: UpdatePersonDto = {
        name: 'Updated Name',
        age: 30,
        email: 'updated@example.com',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(new Error('Person not found'));

      await expect(
        controller.update(nonExistentId, updateDto),
      ).rejects.toThrowError('Person not found');
      expect(service.update).toHaveBeenCalledWith(nonExistentId, updateDto);
    });
  });
});
