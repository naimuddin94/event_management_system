import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooSchema } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Notification extends Document {
  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: MongooSchema.Types.ObjectId, ref: 'User', required: true })
  for: MongooSchema.Types.ObjectId;

  @Prop({ type: MongooSchema.Types.ObjectId, ref: 'User', required: true })
  creator: MongooSchema.Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
