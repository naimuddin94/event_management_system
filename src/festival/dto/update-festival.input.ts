import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateFestivalInput } from './create-festival.input';

@InputType()
export class UpdateFestivalInput extends PartialType(CreateFestivalInput) {
  @Field(() => String)
  id: string;
}
