import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExtractJwt } from 'passport-jwt';
import { GraphQLContext } from 'src/types';
import { CreateFestivalInput } from './dto/create-festival.input';
import { UpdateFestivalInput } from './dto/update-festival.input';
import { GqlFestival } from './entities/festival.entity';
import { FestivalService } from './festival.service';

@Resolver(() => GqlFestival)
export class FestivalResolver {
  constructor(private readonly festivalService: FestivalService) {}

  @Mutation(() => GqlFestival)
  createFestival(
    @Args('createFestivalInput') createFestivalInput: CreateFestivalInput,
    @Context() context: GraphQLContext,
  ) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(context.req);
    return this.festivalService.create(token, createFestivalInput);
  }

  @Query(() => [GqlFestival], { name: 'festivals' })
  findAll() {
    return this.festivalService.findAll();
  }

  @Query(() => GqlFestival, { name: 'festival' })
  findOne(@Args('id') id: string) {
    return this.festivalService.findOne(id);
  }

  @Mutation(() => GqlFestival)
  updateFestival(
    @Args('updateFestivalInput') updateFestivalInput: UpdateFestivalInput,
  ) {
    return this.festivalService.update(
      updateFestivalInput.id,
      updateFestivalInput,
    );
  }

  @Mutation(() => GqlFestival)
  removeFestival(@Args('id') id: string) {
    return this.festivalService.remove(id);
  }
}
