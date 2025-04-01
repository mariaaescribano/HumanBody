import { Controller, Get, Post, Body, Param, Res, HttpException, HttpStatus, Put, UploadedFile, UseInterceptors, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { FichasService } from 'src/fichas/fichas.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { cambiarNombreArchivo, convertFileToBase64, convertirCadenaANumeros, crearYGuardarTxt, descodeReturnFoto, pathACarpetaDeFotos } from '../GlobalHelperBack';
import { NutricomentariosService } from 'src/nutricomentarios/nutricomentarios.service';
import { DiasService } from 'src/dias/dias.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly fichasService: FichasService,
    private readonly nutricomentariosService: NutricomentariosService,
    private readonly diasService: DiasService
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
  async despedirNutri(@Param('userNom') userNom: string) 
  {
    await this.nutricomentariosService.borrarColumna(userNom);
    const userTieneNutriResult = await this.usuariosService.despedirNutriFunction(userNom);
    return userTieneNutriResult;
  }



  
  @Get('patientDiaHoy/:userNom/:fecha')
  async patientDiaHoy(@Param('userNom') userNom: string, @Param('fecha') fecha: string) 
  {
    // take user dias_ids
    let dias_ids = await this.usuariosService.getDias_idsDeUser(userNom)
    let idEnNumberArray = await convertirCadenaANumeros(dias_ids);
    let todosDiasDeFechaHoy = await this.diasService.getAllDiasDeUnaFecha(fecha)

    let idDiaCoincide = -1;

    for (let i = 0; i < idEnNumberArray.length; i++)
    {
      for (let j = 0; j < todosDiasDeFechaHoy.length; j++)
      {
        if(idEnNumberArray[i] == todosDiasDeFechaHoy[j].id)
        {
          idDiaCoincide= idEnNumberArray[i];
          break;
        }
      }
    }

    let dameDia = await this.diasService.getDiaConcreto(idDiaCoincide)
    return dameDia;
  }
  


  // region update Foto
  @Put('editAvatar/:userNom')
  @UseInterceptors(FileInterceptor('perfilPic')) // FileInterceptor maneja el archivo
  async editAvatarNombre(
    @Param('userNom') userNom: string,
    @UploadedFile() file: Express.Multer.File // Recibe el archivo con @UploadedFile
  ) {
    try {
      const fichaObjId = await this.usuariosService.findFichaIdByName(userNom);
      if (!file) {
        throw new Error('No se ha recibido un archivo');
      }
      const base64String = await convertFileToBase64(file);
      const result = await crearYGuardarTxt(userNom, base64String);

      // cambia el nom del file
      
      //cambiarNombreArchivo(pathACarpetaDeFotos,  userNom);

      if (result) 
      {
        await this.fichasService.updatePerfilPic(userNom+".txt", fichaObjId);
        //await this.usuariosService.editAvatarNombreFunction(userNom, newuserNom);
        return { message: 'Avatar actualizado correctamente' };
      } else {
        throw new Error('Error al guardar el archivo');
      }

    } catch (error) {
      throw new Error('Hubo un error al actualizar el usuario');
    }
  }


   // region update Nom
   @Put('editNombre/:newUserNom/:oldUserNom')
   async editNombre(
    @Param('newUserNom') newUserNom: string,
     @Param('oldUserNom') oldUserNom: string
   ) {
     try {
      cambiarNombreArchivo(pathACarpetaDeFotos, oldUserNom , newUserNom);
      const fichaObjId = await this.usuariosService.findFichaIdByName(oldUserNom);
      await this.fichasService.actualizarFotoPerfilRuta(fichaObjId, newUserNom);
      await this.usuariosService.editNombreFunction(oldUserNom, newUserNom);
     } catch (error) {
       throw new Error('Hubo un error al actualizar el usuario');
     }
   }
}
