import { Field, ObjectType } from '@nestjs/graphql';
import { GqlUser } from '../../user/entities/user.entity';

@ObjectType()
export class LoginUserResponse {
  @Field(() => GqlUser)
  user: GqlUser;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  accessToken: string;
}
