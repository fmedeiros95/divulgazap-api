import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device>;

@Schema()
export class Device {
  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop()
  phone: string;

  @Prop({ default: false })
  authed: boolean;

  @Prop()
  session?: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
