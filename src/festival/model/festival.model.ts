import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Feedback, FeedbackSchema } from 'src/feedback/feedback.model';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Festival extends Document {
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

  @Prop({ type: [FeedbackSchema], default: [] })
  feedbacks: Feedback[];

  @Prop({ type: MongooSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooSchema.Types.ObjectId;
}

export const FestivalSchema = SchemaFactory.createForClass(Festival);
