import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from '../schemas';
import { BaileysService } from './baileys.service';

@Injectable()
export class DevicesService implements OnModuleInit {
  constructor(
    private readonly baileysService: BaileysService,
    @InjectModel(Device.name) private deviceModel: Model<Device>
  ) {}

  async onModuleInit() {
    const authedDevices = await this.deviceModel.find({ authed: true }).exec();
    authedDevices.map(device => {
      this.baileysService.initSession(String(device._id));
    });
  }

  async create(createDeviceDto: any): Promise<Device> {
    const createdDevice = new this.deviceModel(createDeviceDto);
    return createdDevice.save();
  }

  async findAll(): Promise<Device[]> {
    return this.deviceModel.find().exec();
  }

  async findOne(id: string): Promise<Device> {
    return this.deviceModel.findById(id);
  }

  async update(id: string, updateDeviceDto: any): Promise<Device> {
    this.deviceModel.updateOne({ _id: id }, updateDeviceDto);

    return this.deviceModel.findById(id);
  }

  async remove(id: string) {
    return this.deviceModel.deleteOne({ _id: id });
  }
}
