import { Module } from '@nestjs/common';
import { NutritionistService } from './nutritionist.service';
import { DatabaseModule } from '../Database/database.module';
import { FichasService } from 'src/fichas/fichas.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { NutricomentariosModule } from 'src/nutricomentarios/nutricomentarios.module';

@Module({
  imports: [DatabaseModule, NutricomentariosModule],  // Importamos el módulo de base de datos
  providers: [NutritionistService, FichasService, UsuariosService],
  exports: [NutritionistService, FichasService, UsuariosService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class NutritionistModule {}