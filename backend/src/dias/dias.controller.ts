import { Controller, Get, Post, Body, Param, Put, NotFoundException } from '@nestjs/common';
import { DiasService } from './dias.service';
import { diasSkeleton } from 'src/dto/dias.dto';
import { convertirCadenaANumeros, removeNameFromConcatenatedList } from 'src/GlobalHelperBack';
import { AlimentosComidosService } from 'src/alimentosComidos/alimentosComidos.service';


@Controller('dias')  // Ruta base para este controlador
export class DiasController {
  constructor(private readonly diasService: DiasService,
    private readonly alimentosComidosService: AlimentosComidosService
  ) {}
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

  @Get("allDias_ids/:userNom")
  async returnReciboConcreto(@Param('userNom') userNom: string) {
    const diaId = await this.diasService.getDiaDeUser(userNom);
    return { diaId };
  }

  @Get("dia/:idDia")
  async diaPorId(@Param('idDia') idDia: number) {
    const dia = await this.diasService.diaPorId(idDia);
    return {dia};
  }

  @Get("existsDay/:fecha/:userNom")
  async existsDay(@Param('fecha') fecha: string, @Param('userNom') userNom: string) {
    const dia = await this.diasService.existsDayFunction(fecha, userNom);
    return {dia};
  }


  @Put("updateCaloriesAlimentosId/:calories/:alimentoIdABorrar/:idDia")
  async updateCaloriesAlimentosId(
    @Param('calories') calories: string, 
    @Param('alimentoIdABorrar') alimentoIdABorrar: string,
    @Param('idDia') idDia: string ) 
  {
    await this.diasService.updateCaloriesFunction(calories, idDia);

    // let diasComidos = await this.cogeAlimentosComidosdia(Number(idDia));
    const alimentos = await this.diasService.diaAlimentosFunction(Number(idDia));
    let alimentosSinalimento = removeNameFromConcatenatedList(alimentos, alimentoIdABorrar)
    await this.diasService.updateAlimentosComidosDeDiaId(alimentosSinalimento.toString(), idDia)
  }


  @Get("diaAlimentos/:idDia")
  async diaAlimentos(@Param('idDia') idDia: number) {
    if(idDia)
    {
      let idsAlimentos = await this.cogeAlimentosComidosdia(idDia)
      if(idsAlimentos.length>0)
      { 
        let guarda:any = [];
        for(let i=0; i< idsAlimentos.length; i++)
        {
          let alimento = await this.alimentosComidosService.returnAlimentoComido(idsAlimentos[i])
          guarda.push(alimento)
        }
        return guarda;
      }
      else 
        return []
    }
    else
      throw new NotFoundException()
  }

  async cogeAlimentosComidosdia(idDia: number)
  {
    const alimentos = await this.diasService.diaAlimentosFunction(idDia);
    // one by one take the alimentos from the bd
    if(alimentos)
    {
      return convertirCadenaANumeros(alimentos, "-")
    }
    else
      return []
  }
  
}
