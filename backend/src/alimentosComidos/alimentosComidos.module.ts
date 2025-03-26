import { Module } from '@nestjs/common';
import { DatabaseModule } from '../Database/database.module';
import { AlimentosComidosService } from './alimentosComidos.service';

@Module({
  imports: [DatabaseModule],  // Importamos el módulo de base de datos
  providers: [AlimentosComidosService],
  exports: [AlimentosComidosService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class AlimentosComidosModule {}