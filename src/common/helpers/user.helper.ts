import * as Chance from 'chance';

const chance = new Chance();

export const FAKE_PASS = 'FakePassword1?';

export const SIGNUP_USER_OP_NAME = 'signUp';
export const SIGNUP_USER_MUTATION = `mutation signUp ($signUpInput: CreateUserInput!) {
    signUp (signUpInput: $signUpInput) {
        _id
        email
        password
        userName
    }
}`;

export const LOGIN_USER_OP_NAME = 'logIn';
export const LOGIN_USER_MUTATION = `mutation logIn ($loginUserInput: LoginUserInput!) {
    logIn (loginUserInput: $loginUserInput) {
        accessToken
        refreshToken
        user {
            _id
            email
            password
            userName
        }
    }
}`;

export const REFRESH_TOKEN_USER_OP_NAME = 'refreshToken';
export const REFRESH_TOKEN_USER_MUTATION = `mutation refreshToken ($refreshTokenInput: RefreshTokenInput!) {
    refreshToken (refreshTokenInput: $refreshTokenInput) {
        accessToken
    }
}`;

export const UPDATE_USER_OP_NAME = 'updateUser';
export const UPDATE_USER_MUTATION = `mutation updateUser ($updateUserInput: UpdateUserInput!) {
    updateUser (updateUserInput: $updateUserInput) {
        _id
        email
        password
        userName
    }
}`;

export const GET_USER_OP_NAME = 'getUserById';
export const GET_USER_QUERY = `query getUserById ($id: String!) {
    getUserById (id: $id) {
        _id
        email
        password
        userName
    }
}`;

export const GET_USERS_OP_NAME = 'getAllUsers';
export const GET_USERS_QUERY = `query getAllUsers ($limit: Int, $skip: Int) {
    getAllUsers (limit: $limit, skip: $skip) {
        usersCount,
        users {
            _id
            email
            password
            userName
        }
    }
}`;

export const generateSignUpUserVariables = () => {
  return {
    signUpInput: {
      userName: chance.name(),
      password: FAKE_PASS,
      email: chance.email(),
    },
  };
};

export const generateUpdateUserVariables = () => {
  return {
    updateUserInput: {
      userName: chance.name(),
    },
  };
};
