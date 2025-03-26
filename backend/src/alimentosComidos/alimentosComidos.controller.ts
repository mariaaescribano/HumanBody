import { Controller, Get, Post, Body, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { AlimentosComidosService } from './alimentosComidos.service';
import { alimentosComidosSkeleton } from 'src/dto/alimentos.dto';


@Controller('alimentosComidos')  // Ruta base para este controlador
export class AlimentosComidosController {
  constructor(private readonly alimentosComidosService: AlimentosComidosService
  ) {}

  @Post('create')
  async create(@Body() body: alimentosComidosSkeleton) 
  {
    return await this.alimentosComidosService.createFunction(body);
  }
  
}
