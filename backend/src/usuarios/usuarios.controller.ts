import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { FichasService } from 'src/fichas/fichas.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly fichasService: FichasService 
  ) {}
  

  @Get()
  async getAllUsers() {
    return await this.usuariosService.findAll();
  }

  @Post("createUser")
  async createUser(@Body() body) {
    return await this.usuariosService.createUser(body);
  }

  @Get("userExist/:nombre")
  async getNameExists(@Param('nombre') nombre: string) {
    const existe = await this.usuariosService.findByName(nombre);
    return { exists: existe };
  }

  @Get("usuCaloriasReciboObjetivo/:nombre")
  async getDatosByName(@Param('nombre') nombre: string) {
    const fichaObjId = await this.usuariosService.findFichaIdByName(nombre);
    const reciboYcalorias = await this.fichasService.findReciboCaloriasDeUserFicha(fichaObjId);
    return  reciboYcalorias[0]  ;
  }

  @Post("login")
  async validUser(@Body() body) {
    let userExists = await this.usuariosService.userValidCredentials(body);
    return { exists: userExists };
  }
}
