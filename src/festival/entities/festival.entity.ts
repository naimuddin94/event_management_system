import { Field, ObjectType } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';
import { GqlUser } from 'src/user/entities/user.entity';

@ObjectType()
export class GqlFestival {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;

  @Field(() => String)
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  location: string;

  @Field(() => Date)
  starts_at: Date;

  @Field(() => Date)
  ends_at: Date;

  @Field(() => GqlUser)
  user: GqlUser;
}
