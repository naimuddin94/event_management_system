import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateScriptInput } from './dto/create-script.input';
import { Script, ScriptDocument } from './model/script.model';

@Injectable()
export class ScriptService {
  constructor(
    @InjectModel(Script.name) private scriptModel: Model<ScriptDocument>,
    private jwtService: JwtService,
  ) {}

  async create(token: string, createScriptInput: CreateScriptInput) {
    const decodedUser = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const script = await this.scriptModel.create({
      author: decodedUser._id,
      ...createScriptInput,
    });

    return await this.scriptModel.findById(script._id).populate('author');
  }
}
