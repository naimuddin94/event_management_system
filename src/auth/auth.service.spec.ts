import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../common/helpers/mongoose.helper';
import { CreateUserInput } from '../user/dto/create-user.input';
import { User, UserSchema } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as Chance from 'chance';
import { USER_ALREADY_EXIST_EXCEPTION } from '../common/exceptions/user.exceptions';

const chance = new Chance();
let user: User;
let refreshToken: string;

const signUpUserInput: CreateUserInput = {
  email: chance.email(),
  userName: chance.string({ length: 12 }),
  password: 'NewPassword2!',
};

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [AuthService, ConfigService, UserService, JwtService],
      imports: [
        UserModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: 'testSecret',
          signOptions: {
            expiresIn: '24h',
          },
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  it('should create a new user account', async () => {
    const user = await service.signUp(signUpUserInput);
    expect(user.password).not.toBe(signUpUserInput.password);
    expect(user._id).toBeDefined();
    expect(user.userName).toBe(signUpUserInput.userName);
    expect(user.email).toBe(signUpUserInput.email);
  });

  it('should throw an error if the user already exists', async () => {
    try {
      await service.signUp(signUpUserInput);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBeDefined();
      expect(error.message).toBe(USER_ALREADY_EXIST_EXCEPTION);
    }
  });

  it('should validate an existing user', async () => {
    const user_ = await service.validateUser({
      email: signUpUserInput.email,
      password: signUpUserInput.password,
    });
    expect(user_).toBeDefined();
    user = user_;
  });

  it('should return null if the user credentials are invalid', async () => {
    const user_ = await service.validateUser({
      email: signUpUserInput.email,
      password: 'IncorrectPassword0!',
    });
    expect(user_).toBeNull();
  });

  it('should log in a validated user, and return a token', async () => {
    const response = service.logIn(user);
    expect(response).toBeDefined();
    expect(response.accessToken).toBeDefined();
    expect(response.refreshToken).toBeDefined();
    refreshToken = response.refreshToken;
    expect(response.user.userName).toBe(user.userName);
  });

  it('should refresh a token', async () => {
    const refTokenInput = { refreshToken: refreshToken };
    const response = service.refreshToken(refTokenInput);
    expect(response).toBeDefined();
    expect(response.accessToken).toBeDefined();
  });
});
