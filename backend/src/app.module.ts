import { Module } from '@nestjs/common';

//MODULES
import { RecibosModule } from './recibos/recibos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DatabaseModule } from './Database/database.module';
import { FichasModule } from './fichas/fichas.module';
import { AlimentosModule } from './alimentos/alimentos.module';

// CONTROLLERS
import { AppController } from './app.controller';
import { UsuariosController } from './usuarios/usuarios.controller';
import { RecibosController } from './recibos/recibos.controller';
import { FichasController } from './fichas/fichas.controller';
import { AlimentosController } from './alimentos/alimentos.controller';

@Module({
  imports: [DatabaseModule, RecibosModule, UsuariosModule, FichasModule, AlimentosModule],  // Importamos todos los módulos necesarios
  controllers: [AppController, RecibosController, UsuariosController, FichasController, AlimentosController],
  providers: [],
})
export class AppModule {}