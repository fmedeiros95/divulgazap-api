import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DevicesService } from '../services';

@Controller()
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @MessagePattern('devices.create')
  async create(createDeviceDto: any) {
    return this.devicesService.create(createDeviceDto);
  }

  @MessagePattern('devices.findAll')
  async findAll() {
    return this.devicesService.findAll();
  }

  @MessagePattern('devices.findOne')
  async findOne(@Payload() id: string) {
    return this.devicesService.findOne(id);
  }

  @MessagePattern('devices.update')
  async update(@Payload() payload: any) {
    return this.devicesService.update(payload.id, payload.updateDeviceDto);
  }

  @MessagePattern('devices.remove')
  async remove(@Payload() id: string) {
    return this.devicesService.remove(id);
  }
}
