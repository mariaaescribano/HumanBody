import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { DatabaseModule } from '../Database/database.module';

@Module({
  imports: [DatabaseModule],  // Importamos el módulo de base de datos
  providers: [UsuariosService],
  exports: [UsuariosService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class UsuariosModule {}