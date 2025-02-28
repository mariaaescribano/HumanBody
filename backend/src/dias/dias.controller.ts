import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { DiasService } from './dias.service';
import { diasSkeleton } from 'src/dto/dias.dto';


@Controller('dias')  // Ruta base para este controlador
export class DiasController {
  constructor(private readonly diasService: DiasService) {}
  @Post('createDia')
  async create(@Body() body: { reciboDeHoy: number, fecha:string, userNom:string }) 
  {
    return await this.diasService.createDia(body.reciboDeHoy, body.fecha, body.userNom);
  }

  // update alimentos y calorias
  @Put("diaAlimCalor/:idDia")
  async updateRecibo(@Param('idDia') idDia: number, @Body() body: { alimentoId: string, calorias: string }) {
    let todoBien = await this.diasService.updateDiaAlimentosCalorias(idDia, body.alimentoId, body.calorias);
    return { message: todoBien ? "Alimentos de día actualizado" : "No ok" };
  }

  @Get("diaAnterior/:userNom/:fecha")
  async returnReciboConcreto(
    @Param('userNom') userNom: string,
    @Param('fecha') fecha: string
  ) {
    const recibo = await this.diasService.getDiaAnteriorDeUser(userNom, fecha);
    return { recibo: recibo };
  }
  
}
