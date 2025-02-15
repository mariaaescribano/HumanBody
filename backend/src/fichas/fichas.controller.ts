import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FichasService } from './fichas.service';
import { fichaSkeleton } from 'src/dto/fichas.dto';

@Controller('fichas')  // Ruta base para este controlador
export class FichasController {
  constructor(private readonly fichasService: FichasService) {}
  @Post('createFicha')
  async create(@Body() ficha: fichaSkeleton) 
  {
    return await this.fichasService.createFicha(ficha);
  }
}
