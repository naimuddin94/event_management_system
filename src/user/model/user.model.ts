import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';
import {
  TUserRole,
  TUserStatus,
  userRoles,
  userStatus,
} from '../user.constant';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class UserModel {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, unique: true })
  userName: string;

  @Prop({ type: String, required: true, select: 0 })
  password: string;

  @Prop({
    type: String,
    default: 'viewer',
    enum: userRoles,
  })
  role: TUserRole;

  @Prop({ default: null })
  googleId: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ default: null })
  refreshToken: string;

  @Prop({ default: 'active', enum: userStatus })
  status: TUserStatus;
}

export type UserDocument = UserModel & Document;
export const UserSchema = SchemaFactory.createForClass(UserModel);

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
