import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExtractJwt } from 'passport-jwt';
import { GraphQLContext } from 'src/types';
import { CreateFestivalInput } from './dto/create-festival.input';
import { UpdateFestivalInput } from './dto/update-festival.input';
import { Festival } from './entities/festival.entity';
import { FestivalService } from './festival.service';

@Resolver(() => Festival)
export class FestivalResolver {
  constructor(private readonly festivalService: FestivalService) {}

  @Mutation(() => Festival)
  createFestival(
    @Args('createFestivalInput') createFestivalInput: CreateFestivalInput,
    @Context() context: GraphQLContext,
  ) {
    console.log('from festival resolver:', JSON.stringify(createFestivalInput));
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(context.req);
    return this.festivalService.create(token, createFestivalInput);
  }

  @Query(() => [Festival], { name: 'festivals' })
  findAll() {
    return this.festivalService.findAll();
  }

  @Query(() => Festival, { name: 'festival' })
  findOne(@Args('id') id: string) {
    return this.festivalService.findOne(id);
  }

  @Mutation(() => Festival)
  updateFestival(
    @Args('updateFestivalInput') updateFestivalInput: UpdateFestivalInput,
  ) {
    return this.festivalService.update(
      updateFestivalInput.id,
      updateFestivalInput,
    );
  }

  @Mutation(() => Festival)
  removeFestival(@Args('id') id: string) {
    return this.festivalService.remove(id);
  }
}
