import { Module } from '@nestjs/common';
import { DatabaseModule } from '../Database/database.module';
import { DiasService } from './dias.service';

@Module({
  imports: [DatabaseModule],  // Importamos el módulo de base de datos
  providers: [DiasService],
  exports: [DiasService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class DiasModule {}