import { Controller, Get, Post, Body, Param, Res, HttpException, HttpStatus, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { NutritionistService } from './nutritionist.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { NutricomentariosService } from 'src/nutricomentarios/nutricomentarios.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { cambiarNombreArchivo, convertFileToBase64, crearYGuardarTxt, pathACarpetaDeFotos } from 'src/GlobalHelperBack';

@Controller('nutritionist')
export class NutritionistController {
  constructor(
    private readonly nutritionistService: NutritionistService,
    private readonly usuariosService: UsuariosService,
    private readonly nutricomentariosService: NutricomentariosService  
  ) {}

  @Post("login")
  async validUser(@Body() body) {
    let userExists = await this.nutritionistService.userValidCredentials(body);
    return { exists: userExists };
  }

  @Get(":nutriNom")
  async getNutri(@Param('nutriNom') nutriNom: string) {
    let dameNutri = await this.nutritionistService.dameNutriFunction(nutriNom);
    return dameNutri;
  }

  @Get("pacients/:nutriNom")
  async pacients(@Param('nutriNom') nutriNom: string) {
    let dameIdNutri = await this.nutritionistService.dameIdNutriFunction(nutriNom);
    let pacientesDeNutri = await this.usuariosService.dameAllPacientesdeNutri(dameIdNutri);
    return { pacientes: pacientesDeNutri };
  }

  @Get("")
  async allNutris() {
    let nutris = await this.nutritionistService.allNutrisFunction();  
    return { nutris };
  }


  @Put("solicitudDeContrato/:userNom/:nutriId")
  async solicitudDeContrato(@Param('userNom') userNom: string, @Param('nutriId') nutriId: number) {
    let result = await this.nutritionistService.addSolicitudDeContrato(userNom, nutriId);
    return { result };
  }

  @Get("solicitudesDeContrato/:nutriNom")
  async solicitudesDeContrato(@Param('nutriNom') nutriNom: string) 
  {
    let usersNoms = await this.nutritionistService.solicitudesDeContratoFunction(nutriNom);
    let guarda: any = [];
    for (let i = 0; i < usersNoms.length; i++) 
    {
      let userData = await this.usuariosService.dameAllUserDeSolicitudDeNutri(usersNoms[i]);
      guarda.push(userData)
    }
    return guarda[0];
  }

  @Get("userHaHechoSolicitud/:userNom")
  async userHaHechoSolicitud(@Param('userNom') userNom: string) 
  {
    let nutri = await this.nutritionistService.userHaHechoSolicitudFunction(userNom);
    return { nutri };
  }

  @Get("nutri/:nutriId")
  async nutri(@Param('nutriId') nutriId: number) 
  {
    let nutri = await this.nutritionistService.nutriFunction(nutriId);
    return { nutri };
  }

  @Put("nutriAcceptRequest/:nutriId/:userNom/:accept")
  async nutriAcceptDeleteRequest(@Param('nutriId') nutriId: number, @Param('userNom') userNom: string, @Param('accept') accept: string ) 
  {
    // delete userNom from requests
    await this.nutritionistService.deleteUserNomFromRequests(nutriId, userNom);
    
    if(accept == "true")
    {
      // add nutriId to user nutritionist column
      await this.usuariosService.userAddNutri(nutriId, userNom);
      // when a user hires a nutri, a row in nutricoments will be created
      await this.nutricomentariosService.addRowForUserByNutri(nutriId, userNom);
    }  
  }




  // region update
  @Put('editAvatar/:nutriNom')
  @UseInterceptors(FileInterceptor('perfilPic')) // FileInterceptor maneja el archivo
  async editAvatarNombre(
    @Param('nutriNom') nutriNom: string,
    @UploadedFile() file: Express.Multer.File // Recibe el archivo con @UploadedFile
  ) {
    if(file && nutriNom)
    {
      const base64String = await convertFileToBase64(file);
      const result = await crearYGuardarTxt(nutriNom, base64String);
      if(result == true)
        await this.nutritionistService.updatePerfilPic(nutriNom);
    }
        
  }
  

  @Put('editNombre/:newUserNom/:oldUserNom')
  async editNombre(
    @Param('newUserNom') newUserNom: string,
    @Param('oldUserNom') oldUserNom: string
  ) {
    try {
      cambiarNombreArchivo(pathACarpetaDeFotos, oldUserNom , newUserNom);
      await this.nutritionistService.editNombreFunction(oldUserNom, newUserNom);
    } catch (error) {
      throw new Error('Hubo un error al actualizar el usuario');
    }
  }

  @Put('editEmailDescrip/:nutriNom')
  async editEmailDescrip(
    @Param('nutriNom') nutriNom: string,
    @Body() body: { descrip: string, email:string }
  ) {
    try 
    {
      await this.nutritionistService.editEmailDescripFunction(nutriNom, body);
    } catch (error) {
      throw new Error('Hubo un error al actualizar el descrip y el email del nutri');
    }
  }


}

  
