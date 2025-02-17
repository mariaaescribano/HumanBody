import { Module } from '@nestjs/common';
import { AlimentosService } from './alimentos.service';
import { DatabaseModule } from '../Database/database.module';

@Module({
  imports: [DatabaseModule],  // Importamos el módulo de base de datos
  providers: [AlimentosService],
  exports: [AlimentosService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class AlimentosModule {}