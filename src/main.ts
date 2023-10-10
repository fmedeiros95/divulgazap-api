import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { AppModule } from './app.module';

const logger = new Logger('Main');
async function bootstrap() {
  // ** Create the application
  const app = await NestFactory.create(AppModule, { cors: true });

  // ** Enable route versioning
  app.enableVersioning();

  // ** Start the application
  await app.listen(3000);

  // ** Print application information
  logger.log(`Application listening on: ${await app.getUrl()}`);
}

// ** Print application information
figlet(process.env.APP_NAME, (_, screen) => {
  console.log(gradient.vice(screen));
  console.log(`-> ${gradient.cristal('Environment:')} ${process.env.NODE_ENV}`);
  console.log();
  bootstrap().catch(error => {
    logger.error(error);
    process.exit(1);
  });
});
