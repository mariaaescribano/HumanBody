import { Controller, Get, Post, Body, Param, Res, HttpException, HttpStatus, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { NutricomentariosService } from './nutricomentarios.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { Response } from 'express';
import { nutriComentarios } from 'src/dto/nutri.dto';
import { convertirCadenaANumeros } from 'src/GlobalHelperBack';
import { AlimentosComidosService } from 'src/alimentosComidos/alimentosComidos.service';
import { alimentosComidosSkeleton } from 'src/dto/alimentos.dto';

@Controller('nutricomentarios')
export class NutricomentariosController {
  constructor(
    private readonly nutricomentariosService: NutricomentariosService,
    private readonly alimentosComidosService: AlimentosComidosService 
  ) {}


  // STRATEGY
  // when a user hires a nutri, a row in nutricoments will be created
  // when nutri writes a coment for the user
  // this comment will be saved by the same function PUT
  // the only thing that changes is in which column is saved

  @Put(":campo/:userNom/:nutriId")
  async nutriWriteComment(
  @Param('campo') campo: nutriComentarios, 
  @Param('userNom') userNom: string, 
  @Param('nutriId') nutriId: string,
  @Body() body: any
) {
    await this.nutricomentariosService.nutriWriteCommentFunction(campo, userNom, nutriId, body);
    return "ok"
  }

  @Put("poraqui/:userNom/:nutriId/:idAlimento")
  async nutriRecomienda(
  @Param('userNom') userNom: string, 
  @Param('nutriId') nutriId: string, 
  @Param('idAlimento') idAlimento: string
) {
    await this.nutricomentariosService.nutriRecomiendaFunction(userNom, nutriId, idAlimento);
  }

  @Get(":campo/:userNom/:nutriId")
  async nutriGetComment( 
  @Param('campo') campo: nutriComentarios, 
  @Param('userNom') userNom: string, 
  @Param('nutriId') nutriId: string,) 
  {
    return await this.nutricomentariosService.nutriGetCommentFunction(campo, userNom, nutriId);
  }

  @Get(":userNom/:nutriId")
  async nutriRecomiendaGetAlimentos( 
  @Param('userNom') userNom: string, 
  @Param('nutriId') nutriId: string,) 
  {
    let idAlimentosString= await this.nutricomentariosService.nutriRecomiendaGetAlimentosFunction(userNom, nutriId);
    if(idAlimentosString[0].nutriRecomienda && idAlimentosString[0].nutriRecomienda.length >0)
    {
      let idsArray = convertirCadenaANumeros(idAlimentosString[0].nutriRecomienda);
      let guarda:alimentosComidosSkeleton[] = [];
      for (let i = 0; i < idsArray.length; i++) 
      {
        let alimento = await this.alimentosComidosService.returnAlimentoComido(idsArray[i])
        guarda.push(alimento)
      }
      return guarda;
    }
    else
      return [];
  }

  @Put("patientResponseNutriRecomienda/:userNom/:nutriId/:idAlimento/:rejected")
  async patientRejectNutriRecomienda(
  @Param('userNom') userNom: string, 
  @Param('nutriId') nutriId: string, 
  @Param('idAlimento') idAlimento: string,
  @Param('rejected') rejected: string
  ) {
    let response=  await this.nutricomentariosService.patientRejectNutriRecomiendaFunction(userNom, nutriId, idAlimento);
    // if rejected, will be deleted from bd
    if(rejected == "true")
      await this.alimentosComidosService.deleteRejectedAlimentoComido(idAlimento)
    return response;
  }


}
