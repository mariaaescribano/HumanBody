import { Controller, Get, Post, Body, Param, Put, NotFoundException, ParseIntPipe } from '@nestjs/common';
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


  // region updateMacro

  @Put("update/:idRecibo")
  async updateRecibo22(
    @Param("idRecibo", ParseIntPipe) idRecibo: number,
    @Body() body: reciboSkeleton
  ) {
    if (!idRecibo || Object.keys(body).length === 0) {
      throw new NotFoundException("Invalid ID or empty request body");
    }

    const updatedRecibo = await this.recibosService.updateRecibo2(idRecibo, body);
    return { message: "Recibo actualizado", recibo: updatedRecibo };
  }
}
  // @Put("updateProteins/:idRecibo")
  // async updateProteins(@Param('idRecibo') idRecibo: number, @Body() body: {proteins, complete, incomplete}) {
  //   if(!idRecibo && !body)
  //     throw new NotFoundException();

  //   const updatedRecibo = await this.recibosService.updateReciboObjetivoProtes(idRecibo, body);
  //   return { message: "Recibo protes actualizado", recibo: updatedRecibo };
  // }

  // @Put("updateFats/:idRecibo")
  // async updateFats(@Param('idRecibo') idRecibo: number, @Body() body: {fats, monoinsaturadas, poliinsaturadas, saturadas}) {
  //   if(!idRecibo && !body)
  //     throw new NotFoundException();

  //   const updatedRecibo = await this.recibosService.updateReciboObjetivoFats(idRecibo, body);
  //   return { message: "Recibo fats actualizado", recibo: updatedRecibo };
  // }

  // @Put("updateCarbs/:idRecibo")
  // async updateCarbs(@Param('idRecibo') idRecibo: number, @Body() body: {carbs, complejos, simples}) {
  //   if(!idRecibo && !body)
  //     throw new NotFoundException();

  //   const updatedRecibo = await this.recibosService.updateReciboObjetivoCarbs(idRecibo, body);
  //   return { message: "Recibo carbs actualizado", recibo: updatedRecibo };
  // }

  // @Put("updateFiber/:idRecibo")
  // async updateFiber(@Param('idRecibo') idRecibo: number, @Body() body: {fiber}) {
  //   if(!idRecibo && !body)
  //     throw new NotFoundException();

  //   const updatedRecibo = await this.recibosService.updateReciboObjetivoFiber(idRecibo, body);
  //   return { message: "Recibo Fiber actualizado", recibo: updatedRecibo };
  // }


