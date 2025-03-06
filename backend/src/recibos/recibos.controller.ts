import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { reciboSkeleton } from 'src/dto/recibos.dto';
import { RecibosService } from './recibos.service';

@Controller('recibos')  // Ruta base para este controlador
export class RecibosController {
  constructor(private readonly recibosService: RecibosService) {}
  
  @Post('createRecibo')
  async create(@Body() recibo: reciboSkeleton) 
  {
    let idRecibo = await this.recibosService.createRecibo(recibo);
    return { idRecibo }; 
  }

  @Get("recibo/:idRecibo")
  async returnReciboConcreto(@Param('idRecibo') idRecibo: number) {
    const recibo = await this.recibosService.returnReciboConcretoFuncion(idRecibo);
    return { recibo: recibo };
  }

  @Put("recibo/:idRecibo")
  async updateRecibo(@Param('idRecibo') idRecibo: number, @Body() updateData: reciboSkeleton) {
    const updatedRecibo = await this.recibosService.updateRecibo(idRecibo, updateData);
    return { message: "Recibo actualizado", recibo: updatedRecibo };
  }

}
