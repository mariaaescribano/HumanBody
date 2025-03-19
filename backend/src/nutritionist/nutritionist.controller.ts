import { Controller, Get, Post, Body, Param, Res, HttpException, HttpStatus, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { NutritionistService } from './nutritionist.service';
import { FichasService } from 'src/fichas/fichas.service';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { Response } from 'express';

@Controller('nutritionist')
export class NutritionistController {
  constructor(
    private readonly nutritionistService: NutritionistService 
  ) {}

  @Post("login")
  async validUser(@Body() body) {
    let userExists = await this.nutritionistService.userValidCredentials(body);
    return { exists: userExists };
  }

}
