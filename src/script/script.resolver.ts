import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ExtractJwt } from 'passport-jwt';
import { GraphQLContext } from 'src/types';
import { CreateScriptInput } from './dto/create-script.input';
import { GqlScript } from './entities/script.entity';
import { ScriptService } from './script.service';

@Resolver(() => GqlScript)
export class ScriptResolver {
  constructor(private readonly scriptService: ScriptService) {}

  @Mutation(() => GqlScript)
  createScript(
    @Args('createScriptInput') createScriptInput: CreateScriptInput,
    @Context() context: GraphQLContext,
  ) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(context.req);
    return this.scriptService.create(token, createScriptInput);
  }
}
