import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooSchema } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Script extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: MongooSchema.Types.ObjectId, ref: 'User', required: true })
  author: MongooSchema.Types.ObjectId;
}

export const ScriptSchema = SchemaFactory.createForClass(Script);
