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
}
