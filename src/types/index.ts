import { Request } from 'express';

export interface GraphQLContext {
  req: Request & {
    cookies: {
      accessToken?: string;
      refreshToken?: string;
    };
  };
}
