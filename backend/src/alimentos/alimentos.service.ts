import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { alimentosSkeleton } from 'src/dto/alimentos.dto';


@Injectable()
export class AlimentosService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllByIdMacro(idMacro: number) 
  {
    const sql = 'SELECT * FROM alimento WHERE predomina = ? LIMIT 30';
    const result = await this.databaseService.query(sql, [idMacro]);
    return result;
  }

  async findMatchingFood(foodName: string) {
    const sql = 'SELECT * FROM alimento WHERE nombre LIKE ? LIMIT 10';
    const result = await this.databaseService.query(sql, [`%${foodName}%`]);
    return result;
  }
  
  async createAlimento(body: alimentosSkeleton) {
    const sql = 'INSERT INTO alimento (nombre, calorias_100gr, gramos, recibo_id, predomina) VALUES (?, ?, ?, ?, ?)';
    const params = [body.nombre, body.calorias_100gr, body.gramos, body.recibo_id, body.predomina];
    await this.databaseService.query(sql, params);
    return "Ok";
  }

  async returnAlimentoConcretoFuncion(idAlimento: number) {
    const sql = 'SELECT * FROM alimento WHERE id = ?';
    const result = await this.databaseService.query(sql, [idAlimento]);
    return result;
  }
 
}