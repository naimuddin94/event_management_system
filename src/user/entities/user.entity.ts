import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Schema as MongooSchema } from 'mongoose';
import {
  TUserRole,
  TUserStatus,
  userRoles,
  userStatus,
} from '../user.constant';

@ObjectType()
@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;

  @Field(() => String)
  @Prop({ type: String, required: true })
  firstName: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  lastName: string;

  @Field(() => String)
  @Prop({ type: String })
  image: string;

  @Field(() => String)
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Field(() => String)
  @Prop({ type: String, required: true, unique: true })
  userName: string;

  @Field(() => String)
  @Prop({ type: String, required: true, select: 0 })
  password: string;

  @Prop({
    type: String,
    default: 'viewer',
    enum: userRoles,
  })
  role: TUserRole;

  @Field(() => String, { nullable: true })
  @Prop({ default: null })
  googleId: string;

  @Field(() => Boolean)
  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Field(() => String, { nullable: true })
  @Prop({ default: null })
  refreshToken: string;

  @Field(() => String)
  @Prop({ default: 'active', enum: userStatus })
  status: TUserStatus;

  @Field()
  createdAt: Date;

  @Field()
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

// Modified password fields before save to database
UserSchema.pre('save', async function (next) {
  try {
    // Check if the password is modified or this is a new user
    if (this.isModified('password') || this.isNew) {
      const hashPassword = await bcrypt.hash(
        this.password,
        Number(process.env.BCRYPT_SALT_ROUNDS),
      );
      this.password = hashPassword;
    }
    next();
  } catch (error: any) {
    next(error);
  }
});
