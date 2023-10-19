import { Controller } from '@nestjs/common';
import { MessagesService } from '../services';

@Controller()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
}
