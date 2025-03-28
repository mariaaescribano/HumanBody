import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { designamealSkeleton } from 'src/dto/meal.dto';

@Injectable()
export class DesignAMealService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createFunction(body: designamealSkeleton) {
    if (!body) {
      throw new NotFoundException();
    }
  
    const sql = `
      INSERT INTO designameal 
      (idDia, meal, nomUser, caloriasTotal, caloriasSelected, proteTotal, fuenteProte, gramosFuenteProte,
       carbsTotal, fuenteCarbs, gramosFuenteCarbs, fatTotal, fuenteFat, gramosFuenteFat,
       fibraTotal, fuenteFibra, gramosFuenteFibra) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const params = [
      body.idDia, body.meal, body.nomUser, body.caloriasTotal, body.caloriasSelected, body.proteTotal, body.fuenteProte, body.gramosFuenteProte,
      body.carbsTotal, body.fuenteCarbs, body.gramosFuenteCarbs, body.fatTotal, body.fuenteFat, body.gramosFuenteFat,
      body.fibraTotal, body.fuenteFibra, body.gramosFuenteFibra
    ];
  
    try {
      const result = await this.databaseService.query(sql, params);
      return result.insertId; // Returns the inserted row ID
    } catch (error) {
      console.error("Database insert error:", error);
      throw new InternalServerErrorException("Failed to insert meal data.");
    }
  }
  
  
}