import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooSchema } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class FestivalModel {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ type: Date, required: true })
  starts_at: Date;

  @Prop({ type: Date, required: true })
  ends_at: Date;

  @Prop({ type: MongooSchema.Types.ObjectId, required: true })
  user: MongooSchema.Types.ObjectId;
}

export type FestivalDocument = FestivalModel & Document;
export const FestivalSchema = SchemaFactory.createForClass(FestivalModel);
