import { Controller, Get, Post, Body, Param, Res, HttpException, HttpStatus, Put, UploadedFile, UseInterceptors, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { FichasService } from 'src/fichas/fichas.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { cambiarNombreArchivo, convertFileToBase64, crearYGuardarTxt, descodeReturnFoto, pathACarpetaDeFotos } from '../GlobalHelperBack';

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



  @Get('recuperarFoto/:nomFile')
  async recuperarFoto(@Param('nomFile') nomFile: string, @Res() res: Response) {
    let base64Data =  await descodeReturnFoto(nomFile);
    if(base64Data) {
      res.setHeader('Content-Type', 'application/json');
      res.send({ imageBase64: base64Data }); // Enviar base64 como respuesta
    } 
  }


  @Get('userTieneNutri/:userNom')
  async userTieneNutri(@Param('userNom') userNom: string) {
    const userTieneNutriResult = await this.usuariosService.userTieneNutriFunction(userNom);
    return userTieneNutriResult;
  }

  @Put('despedirNutri/:userNom')
  async despedirNutri(@Param('userNom') userNom: string) {
    const userTieneNutriResult = await this.usuariosService.despedirNutriFunction(userNom);
    return userTieneNutriResult;
  }


  // region update Foto
  @Put('editAvatarNombre/:userNom')
  @UseInterceptors(FileInterceptor('perfilPic')) // FileInterceptor maneja el archivo
  async editAvatarNombre(
    @Param('userNom') userNom: string,
    @UploadedFile() file: Express.Multer.File, // Recibe el archivo con @UploadedFile
    @Body() body: { newuserNom: string }
  ) {
    const { newuserNom } = body;

    try {
      const fichaObjId = await this.usuariosService.findFichaIdByName(userNom);
      if (!file) {
        throw new Error('No se ha recibido un archivo');
      }
      const base64String = await convertFileToBase64(file);
      const result = await crearYGuardarTxt(newuserNom, base64String);

      // cambia el nom del file
      
      cambiarNombreArchivo(pathACarpetaDeFotos,  userNom, newuserNom);

      if (result) 
      {
        await this.fichasService.updatePerfilPic(newuserNom+".txt", fichaObjId);
        await this.usuariosService.editAvatarNombreFunction(userNom, newuserNom);
        return { message: 'Avatar actualizado correctamente' };
      } else {
        throw new Error('Error al guardar el archivo');
      }

    } catch (error) {
      throw new Error('Hubo un error al actualizar el usuario');
    }
  }
}
