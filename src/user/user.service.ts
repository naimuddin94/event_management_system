import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongoSchema } from 'mongoose';
import { AppError } from 'src/utils';
import { GetPaginatedArgs } from '../common/dto/get-paginated.args';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async findAllUsers(@Args() args: GetPaginatedArgs) {
    const { limit, skip } = args;
    const usersCount = await this.userModel.find().countDocuments();
    const users = await this.userModel.find().skip(skip).limit(limit);
    return {
      usersCount,
      users,
    };
  }

  async findUserById(id: MongoSchema.Types.ObjectId) {
    return this.userModel.findById(id);
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }

  async createUser(createUserInput: CreateUserInput) {
    // Check if the email is already taken
    const existingUser = await this.userModel.findOne({
      email: createUserInput.email,
    });

    if (existingUser) {
      throw new AppError(400, 'The email is already taken.');
    }

    // If the username is not provided, use the email as the username
    if (!createUserInput.userName) {
      createUserInput.userName = createUserInput.email;
    }

    // Check if the username is already taken
    const existingUserName = await this.userModel.findOne({
      userName: createUserInput?.userName,
    });

    if (existingUserName) {
      throw new AppError(400, 'Username is already taken.');
    }

    const createdUser = new this.userModel(createUserInput);

    return createdUser.save();
  }

  async updateUser(
    id: MongoSchema.Types.ObjectId,
    updateUserInput: UpdateUserInput,
  ) {
    if (updateUserInput.userName) {
      // Check if the new username is already taken
      const existingUser = await this.userModel.findOne({
        userName: updateUserInput.userName,
      });
      if (existingUser && existingUser._id.toString() !== id.toString()) {
        throw new Error('The username is already taken.');
      }
    }
    return this.userModel.findByIdAndUpdate(id, updateUserInput, { new: true });
  }

  async removeUser(
    id: MongoSchema.Types.ObjectId,
  ): Promise<{ deletedCount?: number }> {
    return this.userModel.deleteOne({ _id: id });
  }
}
