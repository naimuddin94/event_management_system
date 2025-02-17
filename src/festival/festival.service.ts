import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFestivalInput } from './dto/create-festival.input';
import { UpdateFestivalInput } from './dto/update-festival.input';
import { Festival } from './entities/festival.entity';
import { FestivalDocument } from './model/festival.model';

@Injectable()
export class FestivalService {
  constructor(
    @InjectModel(Festival.name)
    private festivalModel: Model<FestivalDocument>,
    private jwtService: JwtService,
  ) {}

  async create(token: string, createFestivalInput: CreateFestivalInput) {
    const decodedUser = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    return await this.festivalModel.create({
      user: decodedUser._d,
      ...createFestivalInput,
    });
  }

  async findAll() {
    return await this.festivalModel.find();
  }

  async findOne(id: string) {
    return await this.festivalModel.findById(id);
  }

  async update(id: string, updateFestivalInput: UpdateFestivalInput) {
    return await this.festivalModel.findByIdAndUpdate(id, updateFestivalInput, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.festivalModel.findByIdAndDelete(id);
  }
}
