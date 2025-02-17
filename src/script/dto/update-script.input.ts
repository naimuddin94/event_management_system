import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateScriptInput } from './create-script.input';

@InputType()
export class UpdateScriptInput extends PartialType(CreateScriptInput) {
  @Field(() => String)
  id: string;
}
