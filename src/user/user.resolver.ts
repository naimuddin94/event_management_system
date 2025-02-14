import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.gards';
import { GetPaginatedArgs } from '../common/dto/get-paginated.args';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GetUsersPaginatedResponse, User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Query(() => GetUsersPaginatedResponse)
  @UseGuards(JwtAuthGuard)
  getAllUsers(@Args() args: GetPaginatedArgs) {
    return this.userService.findAllUsers(args);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  getUserById(
    @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId,
  ) {
    return this.userService.findUserById(id);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  getUserByEmail(@Args('email', { type: () => String }) email: string) {
    return this.userService.findUserByEmail(email);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.updateUser(updateUserInput._id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async removeUser(
    @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId,
  ): Promise<{ deletedCount?: number }> {
    return this.userService.removeUser(id);
  }
}
