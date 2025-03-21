import { Module } from '@nestjs/common';
import { NutricomentariosService } from './nutricomentarios.service';
import { DatabaseModule } from '../Database/database.module';
import { FichasService } from 'src/fichas/fichas.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Module({
  imports: [DatabaseModule],  // Importamos el módulo de base de datos
  providers: [NutricomentariosService, FichasService, UsuariosService],
  exports: [NutricomentariosService, FichasService, UsuariosService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class NutricomentariosModule {}