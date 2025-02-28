import { Module } from '@nestjs/common';
import { DatabaseModule } from '../Database/database.module';
import { DiasService } from './dias.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';


@Module({
  imports: [DatabaseModule],  // Importamos el módulo de base de datos
  providers: [DiasService, UsuariosService],
  exports: [DiasService, UsuariosService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class DiasModule {}