import { Module } from '@nestjs/common';

//MODULES
import { RecibosModule } from './recibos/recibos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DatabaseModule } from './Database/database.module';
import { FichasModule } from './fichas/fichas.module';
import { DiasModule } from './dias/dias.module';
import { AlimentosModule } from './alimentos/alimentos.module';
import { FidelidadModule } from './fidelidad/fidelidad.module';
import { fidelitytomyselfModule } from './fidelitytomyself/fidelitytomyself.module';
import { NutritionistModule } from './nutritionist/nutritionist.module';
import { NutricomentariosModule } from './nutricomentarios/nutricomentarios.module';
import { AlimentosComidosModule } from './alimentosComidos/alimentosComidos.module';
import { DesignAMealModule } from './designameal/designameal.module';

// CONTROLLERS
import { AppController } from './app.controller';
import { UsuariosController } from './usuarios/usuarios.controller';
import { RecibosController } from './recibos/recibos.controller';
import { FichasController } from './fichas/fichas.controller';
import { AlimentosController } from './alimentos/alimentos.controller';
import { DiasController } from './dias/dias.controller';
import { FidelidadController } from './fidelidad/fidelidad.controller';
import { fidelitytomyselfController } from './fidelitytomyself/fidelitytomyself.controller';
import { NutritionistController } from './nutritionist/nutritionist.controller';
import { NutricomentariosController } from './nutricomentarios/nutricomentarios.controller';
import { AlimentosComidosController } from './alimentosComidos/alimentosComidos.controller';
import { DesignAMealController } from './designameal/designameal.controller';

@Module({
  imports: [DatabaseModule,DesignAMealModule, AlimentosComidosModule, NutricomentariosModule, NutritionistModule, RecibosModule, UsuariosModule, fidelitytomyselfModule, FidelidadModule, FichasModule, AlimentosModule, DiasModule],  
  controllers: [AppController,DesignAMealController, AlimentosComidosController, NutricomentariosController, NutritionistController, RecibosController, fidelitytomyselfController, UsuariosController, FidelidadController, FichasController, AlimentosController, DiasController],
  providers: [],
})
export class AppModule {}