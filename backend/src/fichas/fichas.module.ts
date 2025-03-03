import { Module } from '@nestjs/common';
import { FichasService } from './fichas.service';
import { DatabaseModule } from '../Database/database.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [DatabaseModule, UsuariosModule],  // Importamos el módulo de base de datos
  providers: [FichasService],
  exports: [FichasService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class FichasModule {}