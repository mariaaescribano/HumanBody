import { Controller, Get, Post, Body, Param, Res, HttpException, HttpStatus, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { NutricomentariosService } from './nutricomentarios.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { Response } from 'express';
import { nutriComentarios } from 'src/dto/nutri.dto';

@Controller('nutricomentarios')
export class NutricomentariosController {
  constructor(
    private readonly nutricomentariosService: NutricomentariosService 
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

  @Get(":campo/:userNom/:nutriId")
  async nutriGetComment( 
  @Param('campo') campo: nutriComentarios, 
  @Param('userNom') userNom: string, 
  @Param('nutriId') nutriId: string,) 
  {
    return await this.nutricomentariosService.nutriGetCommentFunction(campo, userNom, nutriId);
  }

}
