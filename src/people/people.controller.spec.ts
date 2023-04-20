import { Test, TestingModule } from '@nestjs/testing';
import { PeopleController } from './people.controller';

describe('PeopleController', () => {
  let controller: PeopleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
    }).compile();

    controller = module.get<PeopleController>(PeopleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of people', async () => {
      const result = [
        { id: 1, name: 'Person 1', age: 20, email: 'person@mail.com' },
      ];
      expect(await controller.findAll()).toBe(result);
    });
  });
});
