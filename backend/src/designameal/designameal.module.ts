import { Module } from '@nestjs/common';
import { DatabaseModule } from '../Database/database.module';
import { DesignAMealService } from './designameal.service';

@Module({
  imports: [DatabaseModule],  // Importamos el módulo de base de datos
  providers: [DesignAMealService],
  exports: [DesignAMealService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class DesignAMealModule {}