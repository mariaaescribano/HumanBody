import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { FidelidadService } from './fidelidad.service';
import { fidelidadSkeleton } from 'src/dto/fidelidad.dto';
import { DiasService } from 'src/dias/dias.service';

@Controller('fidelidad') 
export class FidelidadController {
  constructor(private readonly fidelidadService: FidelidadService,
    private readonly diasService: DiasService
  ) {}

  // se crea una Fidelidad vacia
  @Post('create')
  async create() 
  {
    return await this.fidelidadService.createFidelidad();
  }

  @Put("updateDiaFidelidad/:idDia")
  async updateRecibo(@Param('idDia') idDia: number, @Body() body: fidelidadSkeleton) {
    let dameIdFidelidad =  await this.diasService.dameIdFidelidadDeIdDia(idDia);
    if(dameIdFidelidad)
    {
      let todoBien = await this.fidelidadService.actualizaFidelidad(dameIdFidelidad, body);
      return { message: todoBien ? "Fidelidad de dia actualizado" : "No ok" };
    }
    return "no ok";
  }

  @Get("dameFidelidad/:idDia")
  async getFidelidad(@Param('idDia') idDia: number) {
    try {
      const idFidelidad = await this.diasService.dameIdFidelidadDeIdDia(idDia);
      const fidelidadObject = await this.fidelidadService.getFidelidadPorIdDia(idFidelidad);
      if (!fidelidadObject) {
        console.error(`Fidelidad no encontrada ${idDia}`);
      }
      return fidelidadObject;
    } catch (error) {
      console.error(`Error al obtener fidelidad para el día ${idDia}:`, error);
    }
  }
}
