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

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  starts_at: Date;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  ends_at: Date;
}
