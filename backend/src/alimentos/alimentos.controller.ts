import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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

  @Get("search/:foodName")
  async findMatchingFoodController(@Param('foodName') foodName: string) {
    const foods = await this.alimentosService.findMatchingFood(foodName);
    return { foods: foods };
  }

  @Post("createAlimento")
  async createAlimento(@Body() body: alimentosSkeleton) {
    return await this.alimentosService.createAlimento(body);
  }

  @Get("alimento/:idAlimento")
  async returnAlimentoConcreto(@Param('idAlimento') idAlimento: number) {
    const alimento = await this.alimentosService.returnAlimentoConcretoFuncion(idAlimento);
    return { alimento: alimento };
  }
}
