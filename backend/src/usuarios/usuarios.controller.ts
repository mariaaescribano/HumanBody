import { Controller, Get, Post, Body, Param, Res, HttpException, HttpStatus, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { FichasService } from 'src/fichas/fichas.service';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { Response } from 'express';
import { convertFileToBase64, crearYGuardarTxt } from '../GlobalHelperBack';

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
    const rutaArchivoBase64 = path.join(__dirname, '../../../../../usuariosFotos', nomFile);

    try {
      const base64Data = fs.readFileSync(rutaArchivoBase64, 'utf8'); // Lee el archivo en base64
      res.setHeader('Content-Type', 'application/json');
      res.send({ imageBase64: base64Data }); // Enviar base64 como respuesta
    } catch (error) {
      console.error('Error al leer el archivo Base64:', error);
      res.status(500).send('Error al recuperar la imagen');
    }
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
