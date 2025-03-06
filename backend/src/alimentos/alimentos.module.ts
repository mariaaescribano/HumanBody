import { Module } from '@nestjs/common';
import { AlimentosService } from './alimentos.service';
import { DatabaseModule } from '../Database/database.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { FichasModule } from 'src/fichas/fichas.module';

@Module({
  imports: [DatabaseModule, UsuariosModule, FichasModule],  // Importamos el módulo de base de datos
  providers: [AlimentosService],
  exports: [AlimentosService],  // Exportamos el servicio para usarlo en otros módulos si es necesario
})
export class AlimentosModule {}