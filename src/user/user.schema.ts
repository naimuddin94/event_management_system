import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Document } from 'mongoose';
import { config } from 'src/config';
import { TUserRole, TUserStatus, userRoles, userStatus } from './user.constant';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  image: string;

  @Prop({ required: true, unique: true })
  contactNumber: string;

  @Prop({ required: true, unique: true })
  address: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: userRoles,
  })
  role: TUserRole;

  @Prop({ default: null })
  googleId: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: null })
  refreshToken: string;

  @Prop({ default: 'active', enum: userStatus })
  status: TUserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Modified password fields before save to database
UserSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it has been modified or it's a new user
    if (this.isModified('password') || this.isNew) {
      const saltRounds = Number(config.bcrypt_salt_rounds);

      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});
