import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';
import { TUserRole, TUserStatus } from '../user.constant';

@ObjectType()
export class GqlUser {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  userName: string;

  @Field(() => String)
  role: TUserRole;

  @Field(() => String, { nullable: true })
  googleId: string;

  @Field(() => Boolean)
  isVerified: boolean;

  @Field(() => String, { nullable: true })
  refreshToken: string;

  @Field(() => String)
  status: TUserStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class GetUsersPaginatedResponse {
  @Field(() => [GqlUser], { nullable: false, defaultValue: [] })
  users: GqlUser[];

  @Field(() => Int, { nullable: false, defaultValue: 0 })
  usersCount: number;
}
