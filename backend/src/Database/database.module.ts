import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],  // Hacemos que DatabaseService esté disponible para otros módulos
})
export class DatabaseModule {}