import { Module } from '@nestjs/common';
import { FichasService } from './fichas.service';
import { DatabaseModule } from '../Database/database.module';

@Module({
  imports: [DatabaseModule],  // Importamos el módulo de base de datos
  providers: [FichasService],
  exports: [FichasService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class FichasModule {}