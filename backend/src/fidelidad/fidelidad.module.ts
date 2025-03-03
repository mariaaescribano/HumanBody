import { Module } from '@nestjs/common';
import { DatabaseModule } from '../Database/database.module';
import { FidelidadService } from './fidelidad.service';
import { DiasModule } from 'src/dias/dias.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module'; 

@Module({
  imports: [DatabaseModule, DiasModule, UsuariosModule], // Importamos los módulos correctos
  providers: [FidelidadService], // Solo declaramos FidelidadService
  exports: [FidelidadService], // Exportamos solo lo necesario
})
export class FidelidadModule {}
