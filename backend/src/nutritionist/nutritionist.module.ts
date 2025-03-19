import { Module } from '@nestjs/common';
import { NutritionistService } from './nutritionist.service';
import { DatabaseModule } from '../Database/database.module';
import { FichasService } from 'src/fichas/fichas.service';

@Module({
  imports: [DatabaseModule],  // Importamos el módulo de base de datos
  providers: [NutritionistService, FichasService],
  exports: [NutritionistService, FichasService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class NutritionistModule {}