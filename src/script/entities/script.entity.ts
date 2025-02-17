import { Field, ObjectType } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';
import { GqlUser } from 'src/user/entities/user.entity';

@ObjectType()
export class GqlScript {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  image: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => GqlUser)
  author: GqlUser;
}
