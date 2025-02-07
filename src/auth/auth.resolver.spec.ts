import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { Schema as MongooSchema } from 'mongoose';
import * as Chance from 'chance';
import { CreateUserInput } from '../user/dto/create-user.input';

const userId = new MongooSchema.Types.ObjectId('');
const chance = new Chance();

const signUpUserInput: CreateUserInput = {
  email: chance.email(),
  userName: chance.string({ length: 12 }),
  password: 'NewPassword2!',
};

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            logIn: jest.fn(() => {
              return {
                user: {
                  _id: userId,
                  ...signUpUserInput,
                },
                accessToken:
                  'a-fake-access-token-as-we-tested-our-service-we-are-sure-we-get-it-from-the-service',
                refreshToken:
                  'a-fake-refresh-token-as-we-tested-our-service-we-are-sure-we-get-it-from-the-service',
              };
            }),
            signUp: jest.fn(() => {
              return {
                _id: userId,
                ...signUpUserInput,
              };
            }),
            refreshToken: jest.fn(() => {
              return {
                accessToken:
                  'a-fake-token-as-we-tested-our-service-we-are-sure-we-get-it-from-the-service',
              };
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be able to test logIn', async () => {
    const user = resolver.logIn(
      {
        email: signUpUserInput.email,
        password: signUpUserInput.password,
      },
      {},
    );
    expect(user.user.email).toBe(signUpUserInput.email);
    expect(user.accessToken).toBeDefined();
    expect(user.refreshToken).toBeDefined();
  });

  it('should be able to test signUp', async () => {
    const user = await resolver.signUp(signUpUserInput);
    expect(user.userName).toBe(signUpUserInput.userName);
    expect(user.email).toBe(signUpUserInput.email);
  });

  it('should be able to test refresh', async () => {
    const refreshTokenInput = { refreshToken: 'old-fake-token' };
    const accessToken = resolver.refreshToken(refreshTokenInput);
    expect(accessToken).toBeDefined();
  });
});
