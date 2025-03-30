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
      (idDia, meal, nomUser,actividad, caloriesNeeded , caloriasTotal, caloriasSelected, proteTotal, fuenteProte, gramosFuenteProte,
       carbsTotal, fuenteCarbs, gramosFuenteCarbs, fatTotal, fuenteFat, gramosFuenteFat,
       fibraTotal, fuenteFibra, gramosFuenteFibra) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const params = [
      body.idDia, body.meal, body.nomUser, body.actividad, body.caloriesNeeded, body.caloriasTotal, body.caloriasSelected, body.proteTotal, body.fuenteProte, body.gramosFuenteProte,
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


  async ifExistDesignedMealDeleteIt(userNom: string) {
    const sql = 'DELETE FROM designameal WHERE nomUser = ?';
    const result = await this.databaseService.query(sql, [userNom]);
    return "ok"
  }

  async getmealFunction(idMeal: string) {
    const sql = 'SELECT * FROM designameal WHERE id = ?';
    const result = await this.databaseService.query(sql, [idMeal]);
    return result[0];
  } 

  async mealsOfDayFunction(idDia: string) 
  {
    const sql = 'SELECT * FROM designameal WHERE idDia = ?';
    const result = await this.databaseService.query(sql, [idDia]);
    const ids = result.map((item) => item.id);  
    return ids;
  } 

}