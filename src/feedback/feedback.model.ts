import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Feedback extends Document {
  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: true })
  comment: string;

  @Prop({ type: String, required: true })
  reaction: string;

  @Prop({ type: Number, required: true })
  rate: number;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
