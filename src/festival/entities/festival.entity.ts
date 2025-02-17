import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooSchema } from 'mongoose';

@ObjectType()
@Schema({
  timestamps: true,
  versionKey: false,
})
export class Festival {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;

  @Field(() => String)
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  image: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  description: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  location: string;

  @Field(() => Date)
  @Prop({ type: Date, required: true })
  starts_at: Date;

  @Field(() => Date)
  @Prop({ type: Date, required: true })
  ends_at: Date;

  @Field(() => String)
  @Prop({ type: MongooSchema.Types.ObjectId, required: true })
  user: MongooSchema.Types.ObjectId;
}

export type FestivalDocument = Festival & Document;
export const FestivalSchema = SchemaFactory.createForClass(Festival);
