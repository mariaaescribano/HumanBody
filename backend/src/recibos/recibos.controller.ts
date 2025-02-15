import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { reciboSkeleton } from 'src/dto/recibos.dto';
import { RecibosService } from './recibos.service';

@Controller('recibos')  // Ruta base para este controlador
export class RecibosController {
  constructor(private readonly recibosService: RecibosService) {}
  @Post('createRecibo')
  async create(@Body() recibo: reciboSkeleton) 
  {
    return await this.recibosService.createRecibo(recibo);
  }
}
