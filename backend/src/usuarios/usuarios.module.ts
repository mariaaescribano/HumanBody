import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { DatabaseModule } from '../Database/database.module';
import { FichasService } from 'src/fichas/fichas.service';
import { NutricomentariosModule } from 'src/nutricomentarios/nutricomentarios.module';

@Module({
  imports: [DatabaseModule, NutricomentariosModule],  // Importamos el módulo de base de datos
  providers: [UsuariosService, FichasService],
  exports: [UsuariosService, FichasService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class UsuariosModule {}