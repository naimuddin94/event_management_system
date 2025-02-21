import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooSchema } from 'mongoose';

@Schema({ _id: false, timestamps: true, versionKey: false })
export class Feedback {
  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: true })
  comment: string;

  @Prop({ type: String, required: true })
  reaction: string;

  @Prop({ type: Number, required: true })
  rate: number;

  @Prop({ type: MongooSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooSchema.Types.ObjectId;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
