import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { fidelitytomyselfService } from './fidelitytomyself.service';
import { fidelidadCompleteSkeleton, fidelidadSkeleton } from 'src/dto/fidelidad.dto';
import { DiasService } from 'src/dias/dias.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { FichasService } from 'src/fichas/fichas.service';

@Controller('fidelitytomyself') 
export class fidelitytomyselfController {
  constructor(private readonly fidelitytomyselfService: fidelitytomyselfService,
    private readonly diasService: DiasService,
    private readonly usuariosService: UsuariosService,
    private readonly fichaService: FichasService
  ) {}


  @Post('create')
  async create() 
  {
    return await this.fidelitytomyselfService.createFidelity();
  }

  @Put('updatefidelitytomyself/:userNom')
  async fidelitytomyself(@Param('userNom') userNom: string, @Body() body: fidelidadCompleteSkeleton) 
  {
    const idFicha = await this.usuariosService.findFichaIdByName(userNom);
    const idFidelidad = await this.fichaService.dameIdFidelidad(idFicha);
    let todoBien = await this.fidelitytomyselfService.actualizaFidelity(idFidelidad, body);
    return { message: todoBien ? "ok" : "No ok" };
  }

  @Get("fidelityUser/:userNom")
  async getFidelidad(@Param('userNom') userNom: string) 
  {
    // hacer llamada a usuarios, obtener fichaId
    const idFicha = await this.usuariosService.findFichaIdByName(userNom);
    const idFidelidad = await this.fichaService.dameIdFidelidad(idFicha);
    const datos = await this.fidelitytomyselfService.getDatos(idFidelidad);
    if(datos!=null)
      return datos;

  }
}
