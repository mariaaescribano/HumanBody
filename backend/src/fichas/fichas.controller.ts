import { Controller, Get, Post, Body, Param, Put, NotFoundException } from '@nestjs/common';
import { FichasService } from './fichas.service';
import { fichaSkeleton } from 'src/dto/fichas.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Controller('fichas')  // Ruta base para este controlador
export class FichasController {
  constructor(private readonly fichasService: FichasService,
    private readonly usuarioService: UsuariosService
  ) {}
  
  @Post('createFicha')
  async create(@Body() ficha: fichaSkeleton) 
  {
    return await this.fichasService.createFicha(ficha);
  }

  // borrar true o false
  @Put("updateAlimFav/:userNom/:idAlimento/:add")
  async updateAlimFav(@Param('userNom') userNom: string, @Param('idAlimento') idAlimento: number , @Param('add') add: string) 
  {
    try 
    {
      let dameIdFichaDeUserNameNum = await this.usuarioService.dameIdFichaDeUserName(userNom);
      let todoBien = false;
      if(add == "true")
      {
        todoBien = await this.fichasService.updateAlimFav(dameIdFichaDeUserNameNum, idAlimento);
      }
      else
      {
        todoBien = await this.fichasService.removeAlimFav(dameIdFichaDeUserNameNum, idAlimento);
      }
      return { message: todoBien==true ? "ok" : "No ok" };
    } 
    catch (error) 
    {
      console.log("Error al actualizar la base de datos:", error);
      return "No ok";
    }
  }


  @Get("datosFicha/:userNom")
  async getFicha(@Param('userNom') userNom: string) {
    try {
      let dameIdFichaDeUserNameNum = await this.usuarioService.dameIdFichaDeUserName(userNom);
      const fichaObject = await this.fichasService.getFichaFunction(dameIdFichaDeUserNameNum);
      if (!fichaObject) {
        console.error(`Ficha no encontrada ${dameIdFichaDeUserNameNum}`);
      }
      return fichaObject;
    } catch (error) {
      console.error(`Error al obtener ficha`, error);
    }
  }

  @Put("updateFicha/:userNom")
  async updateFicha(@Param('userNom') userNom: string, @Body() ficha: fichaSkeleton) 
  {
    try 
    {
      if(!userNom)
        throw new NotFoundException();

      let dameIdFichaDeUserNameNum = await this.usuarioService.dameIdFichaDeUserName(userNom);
      let todoBien = await this.fichasService.updateFichaUser(dameIdFichaDeUserNameNum, ficha);
      return { message: todoBien==true ? "ok" : "No ok" };
    } 
    catch (error) 
    {
      console.log("Error al actualizar la ficha de user:", error);
      return "No ok";
    }
  }


}
