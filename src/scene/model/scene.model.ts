import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooSchema } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Scene extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String })
  index: string;

  @Prop({ type: String })
  notes: string;

  @Prop({ type: MongooSchema.Types.ObjectId, ref: 'Script', required: true })
  script: MongooSchema.Types.ObjectId;
}

export type SceneDocument = Scene & Document;
export const SceneSchema = SchemaFactory.createForClass(Scene);
