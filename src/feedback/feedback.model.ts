import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooSchema } from 'mongoose';

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

  @Prop({ type: MongooSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooSchema.Types.ObjectId;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
