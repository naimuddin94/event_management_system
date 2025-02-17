import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../user/dto/create-user.input';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserInput, RefreshTokenInput } from './dto/login-user.input';
import { LoginUserResponse, RefreshTokenResponse } from './dto/login.response';
import { GqlAuthGuard } from './gql-auth.guards';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => User)
  signUp(@Args('signUpInput') signUpInput: CreateUserInput) {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => LoginUserResponse)
  @UseGuards(GqlAuthGuard)
  signIn(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context: any,
  ) {
    return this.authService.signIn(context.user);
  }

  @Mutation(() => RefreshTokenResponse)
  refreshToken(
    @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput,
  ) {
    return this.authService.refreshToken(refreshTokenInput);
  }
}
