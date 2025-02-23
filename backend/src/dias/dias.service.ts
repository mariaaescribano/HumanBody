import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { diasSkeleton } from 'src/dto/dias.dto';


@Injectable()
export class DiasService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createDia(reciboId: number) 
  {
    const sql = 'INSERT INTO `dias`(`fidelidad_id`, `recibo_id`, `calorias_total`, `alimentos_id`) VALUES (?,?,?,?)';
    const params = [-1, reciboId, "0", ""];
    const result = await this.databaseService.query(sql, params);
    const insertId = result.insertId;
    return insertId;
  }

  async updateDiaAlimentosCalorias(idRecibo: number, alimentoId:string, calorias:string) {
    const sql = `UPDATE dias SET calorias_total = ?, alimentos_id = CONCAT(alimentos_id, '-', ?) WHERE id = ?`;
    await this.databaseService.query(sql, [ calorias, alimentoId, idRecibo]);
    return true;
  }
  
}