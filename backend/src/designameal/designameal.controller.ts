import { Controller, Get, Post, Body, Param, Delete, BadRequestException, NotFoundException, Put } from '@nestjs/common';
import { DesignAMealService } from './designameal.service';
import { designamealSkeleton } from 'src/dto/meal.dto';

@Controller('designameal') 
export class DesignAMealController {
  constructor(private readonly designamealService: DesignAMealService
  ) {}

  @Post('create')
  async create(@Body() body: designamealSkeleton) 
  {
    // STRATEGY
    // user can only have 1 designed meal in BD 
    // (because the ones that did will be deleted, they are NOT needed)
    await this.designamealService.ifExistDesignedMealDeleteIt(body.nomUser)
    return await this.designamealService.createFunction(body);
  }

  @Delete('delete/:userNom')
  async delete(@Param("userNom") userNom: string) 
  {
    return await this.designamealService.ifExistDesignedMealDeleteIt(userNom)
  }

  @Get('meal/:idMeal')
  async getmeal(@Param("idMeal") idMeal: string) 
  {
    return await this.designamealService.getmealFunction(idMeal)
  }

  @Get('mealsOfDay/:idDia/:userNom')
  async mealsOfDay(@Param("idDia") idDia: string, @Param("userNom") userNom: string) 
  {
    return await this.designamealService.mealsOfDayFunction(idDia, userNom)
  }

  @Put('approve/:idDia/:userNom')
  async approveByNutri(@Param("idDia") idDia: string, @Param("userNom") userNom: string) 
  {
    let resp = await this.designamealService.isDesignaMealApprovedByNutri(idDia, userNom)
    console.log(resp)
    if(resp==0)
    {
      await this.designamealService.approveByNutriFunction(idDia, userNom);
      return "approved"
    }
    else
      return "Already approved"
  }

  @Get('isApproved/:idDia/:userNom')
  async isApproved(@Param("idDia") idDia: string, @Param("userNom") userNom: string) 
  {
    return await this.designamealService.isDesignaMealApprovedByNutri(idDia, userNom)
  }

}
