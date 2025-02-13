import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as Chance from 'chance';
import { Schema as MongooSchema } from 'mongoose';
import { GetPaginatedArgs } from '../common/dto/get-paginated.args';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../common/helpers/mongoose.helper';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserSchema } from './entities/user.entity';
import { UserService } from './user.service';

let userId = new MongooSchema.Types.ObjectId('');
const chance = new Chance();

export const createUserInput: CreateUserInput = {
  firstName: 'John',
  lastName: 'Doe',
  userName: chance.name(),
  password: 'FakePassword1?',
  email: chance.email(),
};

const updateUserInput: UpdateUserInput = {
  _id: new MongooSchema.Types.ObjectId(''),
  userName: chance.name(),
};

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
      providers: [UserService, ConfigService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    try {
      if (module) {
        await module.close();
      }
      await closeInMongodConnection();
    } catch (error) {
      console.log(error);
    }
  });

  it('should create a user', async () => {
    const user = await service.createUser(createUserInput);
    expect(user).toBeDefined();
    expect(user).not.toBeNull();
    expect(user._id).toBeDefined();
    expect(user.userName).toBe(createUserInput.userName);
    expect(user.email).toBe(createUserInput.email);
    expect(user.password).not.toBeNull();
    updateUserInput._id = user._id;
    userId = user._id;
  });

  it('should get a list of users', async () => {
    const paginationQuery: GetPaginatedArgs = { skip: 0, limit: 10 };
    const users = await service.findAllUsers(paginationQuery);
    expect(users).toBeDefined();
    expect(Array.isArray(users.users)).toBe(true);
    expect(users.usersCount).toBe(1);
    expect(users.users[0].userName).toBe(createUserInput.userName);
    expect(users.users[0].email).toBe(createUserInput.email);
    expect(users.users[0].password).not.toBeNull();
  });

  it('should get the user by its id', async () => {
    const user = await service.findUserById(userId);
    expect(user).toBeDefined();
    expect(user).not.toBeNull();
    expect(user.id).toBe(userId.toString());
  });

  it('should get the user by its email address', async () => {
    const user = await service.findUserByEmail(createUserInput.email);
    expect(user).toBeDefined();
    expect(user).not.toBeNull();
    expect(user.id).toBe(userId.toString());
  });

  it('should update some user properties', async () => {
    const updatedUser = await service.updateUser(
      updateUserInput._id,
      updateUserInput,
    );
    expect(updatedUser).toBeDefined();
    expect(updatedUser).not.toBeNull();
    expect(updatedUser.id).toBe(userId.toString());
    expect(updatedUser.userName).not.toBe(createUserInput.userName);
    expect(updatedUser.email).toBe(createUserInput.email);
  });

  it('should delete the testing user', async () => {
    const deletedUser = await service.removeUser(updateUserInput._id);
    expect(deletedUser).toBeDefined();
  });

  it('should receive not found error for getting the deleted user', async () => {
    try {
      const user = await service.findUserById(userId);
      expect(user).toBeDefined();
      expect(user).toBeNull();
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response).toBeDefined();
      expect(err.response.statusCode).toBe(404);
    }
  });

  it('should not be able to update an non existing user', async () => {
    try {
      const user = await service.updateUser(
        updateUserInput._id,
        updateUserInput,
      );
      expect(user).toBeDefined();
      expect(user).toBeNull();
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response).toBeDefined();
      expect(err.response.statusCode).toBe(404);
    }
  });
});
