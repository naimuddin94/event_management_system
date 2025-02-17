import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { RefreshTokenInput } from '../src/auth/dto/login-user.input';
import { GetPaginatedArgs } from '../src/common/dto/get-paginated.args';
import {
  CODE_STATUSES,
  GRAPHQL_ENDPOINT,
} from '../src/common/helpers/graphql.helper';
import {
  FAKE_PASS,
  generateSignUpUserVariables,
  generateUpdateUserVariables,
  GET_USER_OP_NAME,
  GET_USER_QUERY,
  GET_USERS_OP_NAME,
  GET_USERS_QUERY,
  LOGIN_USER_MUTATION,
  LOGIN_USER_OP_NAME,
  REFRESH_TOKEN_USER_MUTATION,
  REFRESH_TOKEN_USER_OP_NAME,
  SIGNUP_USER_MUTATION,
  SIGNUP_USER_OP_NAME,
  UPDATE_USER_MUTATION,
  UPDATE_USER_OP_NAME,
} from '../src/common/helpers/user.helper';
import { GqlUser } from '../src/user/entities/user.entity';

describe('User Resolver (e2e)', () => {
  let app: INestApplication;
  let user: GqlUser;
  let accessToken, refreshToken;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should sign up a new user', () => {
    const signUpInput = generateSignUpUserVariables().signUpInput;
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: SIGNUP_USER_OP_NAME,
        query: SIGNUP_USER_MUTATION,
        variables: { signUpInput },
      })
      .expect(CODE_STATUSES.OK)
      .expect((res) => {
        expect(res.body.data.signUp).toBeDefined();
        user = res.body.data.signUp;
        expect(user._id).toBeDefined();
        expect(user.userName).toBe(signUpInput.userName);
        expect(user.email).toBe(signUpInput.email);
      });
  });

  it('should login a user', () => {
    const loginUserInput = { email: user.email, password: FAKE_PASS };
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: LOGIN_USER_OP_NAME,
        query: LOGIN_USER_MUTATION,
        variables: { loginUserInput },
      })
      .expect(CODE_STATUSES.OK)
      .expect((res) => {
        expect(res.body.data.logIn).toBeDefined();
        expect(res.body.data.logIn.accessToken).toBeDefined();
        expect(res.body.data.logIn.refreshToken).toBeDefined();
        accessToken = res.body.data.logIn.accessToken;
        refreshToken = res.body.data.logIn.refreshToken;
        expect(user._id).toBeDefined();
        expect(user.email).toBe(loginUserInput.email);
      });
  });

  it('should update a user', () => {
    const updateUserInput = generateUpdateUserVariables().updateUserInput;
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        operationName: UPDATE_USER_OP_NAME,
        query: UPDATE_USER_MUTATION,
        variables: { updateUserInput: { ...updateUserInput, _id: user._id } },
      })
      .expect(CODE_STATUSES.OK)
      .expect((res) => {
        expect(res.body.data.updateUser).toBeDefined();
        const updatedUser = res.body.data.updateUser;
        expect(updatedUser._id).toBeDefined();
        expect(updatedUser.userName).toBe(updateUserInput.userName);
        expect(updatedUser.userName).not.toBe(user.userName);
        expect(updatedUser.email).toBe(user.email);
      });
  });

  it('should get one user', () => {
    const id: any = { id: user._id.toString() };
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        operationName: GET_USER_OP_NAME,
        query: GET_USER_QUERY,
        variables: id,
      })
      .expect(CODE_STATUSES.OK)
      .expect((res) => {
        expect(res.body.data.getUserById).toBeDefined();
        expect(res.body.data.getUserById._id).toBe(user._id);
        expect(res.body.data.getUserById.email).toBe(user.email);
      });
  });

  it('should get a list of users', () => {
    const paginationQuery: GetPaginatedArgs = { skip: 0, limit: 10 };
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        operationName: GET_USERS_OP_NAME,
        query: GET_USERS_QUERY,
        variables: paginationQuery,
      })
      .expect(CODE_STATUSES.OK)
      .expect((res) => {
        expect(res.body.data.getAllUsers.usersCount).toBeDefined();
        expect(res.body.data.getAllUsers.usersCount).toBeGreaterThanOrEqual(1);
        expect(Array.isArray(res.body.data.getAllUsers.users)).toBe(true);
      });
  });

  it('should refresh a users token', () => {
    const refreshTokenInput: RefreshTokenInput = { refreshToken: refreshToken };
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        operationName: REFRESH_TOKEN_USER_OP_NAME,
        query: REFRESH_TOKEN_USER_MUTATION,
        variables: { refreshTokenInput },
      })
      .expect(CODE_STATUSES.OK)
      .expect((res) => {
        expect(res.body.data).toBeDefined();
        expect(res.body.data.refreshToken.accessToken).toBeDefined();
        accessToken = res.body.data.refreshToken.accessToken;
      });
  });

  it('should get a list of users with new accessToken', () => {
    const paginationQuery: GetPaginatedArgs = { skip: 0, limit: 10 };
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        operationName: GET_USERS_OP_NAME,
        query: GET_USERS_QUERY,
        variables: paginationQuery,
      })
      .expect(CODE_STATUSES.OK)
      .expect((res) => {
        expect(res.body.data.getAllUsers.usersCount).toBeDefined();
        expect(res.body.data.getAllUsers.usersCount).toBeGreaterThanOrEqual(1);
        expect(Array.isArray(res.body.data.getAllUsers.users)).toBe(true);
      });
  });

  // It should delete a user
});
