import { Field, ObjectType } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';

@ObjectType()
export class Festival {
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

  @Field(() => String)
  user: MongooSchema.Types.ObjectId;
}
