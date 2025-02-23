import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Festival extends Document {
  @Prop({ type: String, required: true })
  curr_scene: string;

  @Prop({ type: String, required: true })
  duration: string;

  @Prop({ type: String, required: true })
  num_scene: string;

  @Prop({ type: Date, required: true })
  starts_at: Date;
}

export const FestivalSchema = SchemaFactory.createForClass(Festival);
