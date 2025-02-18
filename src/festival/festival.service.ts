import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFestivalInput } from './dto/create-festival.input';
import { UpdateFestivalInput } from './dto/update-festival.input';
import { Festival } from './model/festival.model';

@Injectable()
export class FestivalService {
  constructor(
    @InjectModel(Festival.name)
    private festivalModel: Model<Festival>,
    private jwtService: JwtService,
  ) {}

  async create(token: string, createFestivalInput: CreateFestivalInput) {
    const decodedUser = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const festival = await this.festivalModel.create({
      user: decodedUser._id,
      ...createFestivalInput,
    });

    return await this.festivalModel.findById(festival._id).populate('user');
  }

  async findAll() {
    return await this.festivalModel.find().populate('user');
  }

  async findOne(id: string) {
    return await this.festivalModel.findById(id).populate('user');
  }

  async update(id: string, updateFestivalInput: UpdateFestivalInput) {
    return await this.festivalModel
      .findByIdAndUpdate(id, updateFestivalInput, {
        new: true,
      })
      .populate('user');
  }

  async remove(id: string) {
    return await this.festivalModel.findByIdAndDelete(id).populate('user');
  }
}
