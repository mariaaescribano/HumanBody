import { Module } from '@nestjs/common';
import { DatabaseModule } from '../Database/database.module';
import { fidelitytomyselfService } from './fidelitytomyself.service';
import { DiasModule } from 'src/dias/dias.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module'; 
import { FichasModule } from 'src/fichas/fichas.module';

@Module({
  imports: [DatabaseModule, DiasModule, UsuariosModule, FichasModule], // Importamos los módulos correctos
  providers: [fidelitytomyselfService], // Solo declaramos FidelidadService
  exports: [fidelitytomyselfService], // Exportamos solo lo necesario
})
export class fidelitytomyselfModule {}
