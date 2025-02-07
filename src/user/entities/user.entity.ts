import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class User {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;

  @Field(() => String)
  @Prop({ unique: true })
  email: string;

  @Field(() => String)
  @Prop()
  userName: string;

  @Field(() => String)
  @Prop()
  password: string;

  @Field(() => [String])
  @Prop()
  roles: string[];

  @Field()
  @Prop()
  createdAt: Date;

  @Field()
  @Prop()
  updatedAt: Date;
}

@ObjectType()
export class GetUsersPaginatedResponse {
  @Field(() => [User], { nullable: false, defaultValue: [] })
  users: User[];

  @Field(() => Int, { nullable: false, defaultValue: 0 })
  usersCount: number;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
