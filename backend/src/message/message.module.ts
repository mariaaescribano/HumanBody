import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { DatabaseModule } from 'src/Database/database.module';

@Module({
  imports: [DatabaseModule],  
  providers: [MessageService],
  exports: [MessageService],  
})
export class MessageModule {}