import { Controller, Get, Post, Body, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { MessageService } from './message.service';
import { messageSkeleton } from 'src/dto/message.dto';

@Controller('messages')  
export class MessageController {
  constructor(private readonly messageService: MessageService
  ) {}

  @Post("create")
  async createMessage(@Body() body: messageSkeleton) {
    return await this.messageService.createMessageFunction(body);
  }
  
}
