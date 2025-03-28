import { Controller, Get, Post, Body, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { DesignAMealService } from './designameal.service';
import { designamealSkeleton } from 'src/dto/meal.dto';

@Controller('designameal') 
export class DesignAMealController {
  constructor(private readonly designamealService: DesignAMealService
  ) {}

  @Post('create')
  async create(@Body() body: designamealSkeleton) 
  {
    return await this.designamealService.createFunction(body);
  }

}
