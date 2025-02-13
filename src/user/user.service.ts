import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooSchema } from 'mongoose';
import { GetPaginatedArgs } from '../common/dto/get-paginated.args';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
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

  async findUserById(id: MongooSchema.Types.ObjectId) {
    return this.userModel.findById(id);
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async createUser(createUserInput: CreateUserInput) {
    if (!createUserInput.userName) {
      createUserInput.userName = createUserInput.email;
    }

    const createdUser = new this.userModel(createUserInput);

    return createdUser.save();
  }

  async updateUser(
    id: MongooSchema.Types.ObjectId,
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
    id: MongooSchema.Types.ObjectId,
  ): Promise<{ deletedCount?: number }> {
    return this.userModel.deleteOne({ _id: id });
  }
}
