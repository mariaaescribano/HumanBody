import { Module } from '@nestjs/common';
import { RecibosService } from './recibos.service';
import { DatabaseModule } from '../Database/database.module';

@Module({
  imports: [DatabaseModule],  // Importamos el módulo de base de datos
  providers: [RecibosService],
  exports: [RecibosService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class RecibosModule {}