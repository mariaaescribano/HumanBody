import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AlimentosService } from './alimentos.service';
import { alimentosSkeleton } from 'src/dto/alimentos.dto';

@Controller('alimentos')  // Ruta base para este controlador
export class AlimentosController {
  constructor(private readonly alimentosService: AlimentosService) {}

  @Get("macroPredomina/:idMacro")
  async getNameExists(@Param('idMacro') idMacro: number) {
    const foods = await this.alimentosService.findAllByIdMacro(idMacro);
    return { foods: foods };
  }

  @Get("userFoodMacro/:idMacro/:userNom")
  async getuserFoodMacro(@Param('idMacro') idMacro: number, @Param('userNom') userNom: string) {
    const foods = await this.alimentosService.findUserMacroFoods(idMacro, userNom);
    return { foods: foods };
  }

  @Get("search/:foodName")
  async findMatchingFoodController(@Param('foodName') foodName: string) {
    const foods = await this.alimentosService.findMatchingFood(foodName);
    return { foods: foods };
  }

  @Post("createAlimento/:userNom")
  async createAlimento(@Body() body: alimentosSkeleton, @Param('userNom') userNom: string) {
    return await this.alimentosService.createAlimento(body, userNom);
  }

  @Get("alimento/:idAlimento")
  async returnAlimentoConcreto(@Param('idAlimento') idAlimento: number) {
    const alimento = await this.alimentosService.returnAlimentoConcretoFuncion(idAlimento);
    return { alimento: alimento };
  }

  @Delete("deleteAlimento/:idAlimento/:userNom")
  async deleteAlimento(@Param('idAlimento') idAlimento: number, @Param('userNom') userNom: string) {
    const seHaEliminado = await this.alimentosService.deleteAlimentoFuncion(idAlimento, userNom);
    return seHaEliminado ? true : false;
  }

  
}
