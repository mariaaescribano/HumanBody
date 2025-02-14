import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { reciboSkeleton } from 'src/dto/recibo.dto';

@Injectable()
export class RecibosService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createRecibo(recibo: reciboSkeleton) 
  {
    const sql = 'INSERT INTO recibo (grasas, monoinsaturadas, poliinsaturadas, saturadas, prote, incompleto, completo, carbs, complejos, simples, fibra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [recibo.grasas, recibo.monoinsaturadas, recibo.poliinsaturadas, recibo.saturadas, recibo.prote, recibo.incompleto, recibo.completo, recibo.carbs, recibo.complejos, recibo.simples, recibo.fibra];
    const result = await this.databaseService.query(sql, params);
    const idRecibo = result.insertId;
    return idRecibo;
  }
}