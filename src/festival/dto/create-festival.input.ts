import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateFestivalInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  image: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  location: string;

  @Field(() => String)
  @IsDateString()
  @IsNotEmpty()
  starts_at: string;

  @Field(() => String)
  @IsDateString()
  @IsNotEmpty()
  ends_at: string;
}
