import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesController, MessagesController } from './controllers';
import { Device, DeviceSchema, Message, MessageSchema } from './schemas';
import { BaileysService, DevicesService, MessagesService } from './services';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:root@localhost/divulgazap_db?authSource=admin'),
    MongooseModule.forFeature([
      { name: Device.name, schema: DeviceSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [DevicesController, MessagesController],
  providers: [BaileysService, DevicesService, MessagesService],
})
export class BaileysModule {}
