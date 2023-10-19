import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BaileysModule } from './baileys.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BaileysModule, {
    transport: Transport.TCP,
    options: { port: 3002 },
  });
  await app.listen();
}
bootstrap();
