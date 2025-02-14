import { Module } from '@nestjs/common';
import { CatsModule } from './recibos/recibos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DatabaseModule } from './Database/database.module';
import { AppController } from './app.controller';
import { UsuariosController } from './usuarios/usuarios.controller';
import { RecibosController } from './recibos/recibos.controller';

@Module({
  imports: [DatabaseModule, CatsModule, UsuariosModule],  // Importamos todos los módulos necesarios
  controllers: [AppController, RecibosController, UsuariosController],
  providers: [],
})
export class AppModule {}