import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { reciboSkeleton } from 'src/dto/recibos.dto';

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

  async returnReciboConcretoFuncion(idRecibo: number) {
    const sql = 'SELECT * FROM recibo WHERE id = ?';
    const result = await this.databaseService.query(sql, [idRecibo]);
    return result;
  }

  // cambia todos los campos del recibo con el id especificado
  async updateRecibo(idRecibo: number, updateData: reciboSkeleton) {
    console.log(updateData)
    const sql = `UPDATE recibo SET 
    grasas = ?, 
    monoinsaturadas = ?, 
    poliinsaturadas = ?,
    saturadas = ?,
    prote = ?,
    incompleto = ?,
    completo = ?,
    carbs = ?,
    complejos = ?,
    simples = ?,
    fibra = ?
    WHERE id = ?`;
    await this.databaseService.query(sql, [updateData.grasas, 
      updateData.monoinsaturadas, updateData.poliinsaturadas, updateData.saturadas, 
      updateData.prote, updateData.incompleto,updateData.completo, updateData.carbs, updateData.complejos,
      updateData.simples, updateData.fibra
      , idRecibo]);
    return this.returnReciboConcretoFuncion(idRecibo); // Retorna el recibo actualizado
  }
}