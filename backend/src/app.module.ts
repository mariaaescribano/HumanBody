import { Module } from '@nestjs/common';

//MODULES
import { RecibosModule } from './recibos/recibos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DatabaseModule } from './Database/database.module';
import { FichasModule } from './fichas/fichas.module';

// CONTROLLERS
import { AppController } from './app.controller';
import { UsuariosController } from './usuarios/usuarios.controller';
import { RecibosController } from './recibos/recibos.controller';
import { FichasController } from './fichas/fichas.controller';

@Module({
  imports: [DatabaseModule, RecibosModule, UsuariosModule, FichasModule],  // Importamos todos los módulos necesarios
  controllers: [AppController, RecibosController, UsuariosController, FichasController],
  providers: [],
})
export class AppModule {}