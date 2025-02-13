import { Test, TestingModule } from '@nestjs/testing';
import * as Chance from 'chance';
import { Schema as MongooSchema } from 'mongoose';
import { GetPaginatedArgs } from '../common/dto/get-paginated.args';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

let userId = new MongooSchema.Types.ObjectId('');
let email: string = '';
const chance = new Chance();

const createUserInput: CreateUserInput = {
  firstName: 'John',
  lastName: 'Doe',
  userName: chance.name(),
  password: 'FakePassword1?',
  email: chance.email(),
};

const updateUserInput: UpdateUserInput = {
  _id: userId,
  userName: chance.name(),
} as any;

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(() => {
              return {
                _id: userId,
                ...createUserInput,
              };
            }),
            findAllUsers: jest.fn(() => {
              return [
                {
                  _id: userId,
                  ...createUserInput,
                },
              ];
            }),
            findUserById: jest.fn(() => {
              return {
                _id: userId,
                ...createUserInput,
              };
            }),
            findUserByEmail: jest.fn(() => {
              return {
                _id: userId,
                ...createUserInput,
              };
            }),
            updateUser: jest.fn(() => {
              return {
                _id: userId,
                ...createUserInput,
                ...updateUserInput,
              };
            }),
            removeUser: jest.fn(() => {
              return {};
            }),
          },
        },
      ],
    }).compile();
    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be able to test userService.createUser', async () => {
    const user = await resolver.createUser(createUserInput);
    expect(user._id).toBeDefined();
    expect(user._id).toBe(userId);
    expect(user.userName).toBe(createUserInput.userName);
    expect(user.email).toBe(createUserInput.email);
    userId = user._id;
    email = user.email;
    updateUserInput._id = user._id;
  });

  it('should be able to test userService.findAllUsers', async () => {
    const paginationQuery: GetPaginatedArgs = { skip: 0, limit: 10 };
    const users = await resolver.getAllUsers(paginationQuery);
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users[0]._id).toBe(userId);
  });

  it('should be able to test userService.findUserById', async () => {
    const user = await resolver.getUserById(userId);
    expect(user).toBeDefined();
    expect(user._id).toBe(userId);
  });

  it('should be able to test userService.findUserByEmail', async () => {
    const user = await resolver.getUserByEmail(email?.toString());
    expect(user).toBeDefined();
    expect(user._id).toBe(userId);
  });

  it('should be able to test userService.updateUser', async () => {
    const updated = await resolver.updateUser(updateUserInput);
    expect(updated._id).toBe(userId);
    expect(updated.userName).toBe(updateUserInput.userName);
  });

  it('should be able to test userService.removeUser ', async () => {
    const removedUser = await resolver.removeUser(userId);
    expect(removedUser).toBeDefined();
  });
});
