import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { reciboSkeleton } from 'src/dto/recibos.dto';

@Injectable()
export class RecibosService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createRecibo(recibo: reciboSkeleton) 
  {
    if(recibo)
    {
      const sql = 'INSERT INTO recibo (grasas, monoinsaturadas, poliinsaturadas, saturadas, prote, incompleto, completo, carbs, complejos, simples, fibra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const params = [recibo.grasas, recibo.monoinsaturadas, recibo.poliinsaturadas, recibo.saturadas, recibo.prote, recibo.incompleto, recibo.completo, recibo.carbs, recibo.complejos, recibo.simples, recibo.fibra];
      try {
        const result = await this.databaseService.query(sql, params);
        return result.insertId;
      } catch (error) {
        console.error("Error al insertar recibo:", error);
        throw new InternalServerErrorException(error.message);
      }
    }
    else
      throw new NotFoundException();
   
  }

  async returnReciboConcretoFuncion(idRecibo: number) {
    const sql = 'SELECT * FROM recibo WHERE id = ?';
    const result = await this.databaseService.query(sql, [idRecibo]);
    return result;
  }

  // cambia todos los campos del recibo con el id especificado
  async updateRecibo(idRecibo: number, updateData: reciboSkeleton) {
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



  // region updateMacro
  async updateRecibo2(idRecibo: number, updates: Partial<Record<string, any>>) {
    const keys = Object.keys(updates);
    if (keys.length === 0) return this.returnReciboConcretoFuncion(idRecibo);

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const values = keys.map((key) => updates[key]);

    const sql = `UPDATE recibo SET ${setClause} WHERE id = ?`;
    await this.databaseService.query(sql, [...values, idRecibo]);

    return "ok";
  }

  // async updateReciboObjetivoProtes(idRecibo: number, body: {proteins, complete, incomplete}) {
  //   const sql = `UPDATE recibo SET 
  //   prote = ?,
  //   incompleto = ?,
  //   completo = ?
  //   WHERE id = ?`;
  //   await this.databaseService.query(sql, [body.proteins, body.incomplete, body.complete, idRecibo]);
  //   return this.returnReciboConcretoFuncion(idRecibo); // Retorna el recibo actualizado
  // }

  // async updateReciboObjetivoFats(idRecibo: number, body: {fats, monoinsaturadas, poliinsaturadas, saturadas}) {
  //   const sql = `UPDATE recibo SET 
  //   grasas= ?, 	monoinsaturadas = ?,	poliinsaturadas = ?,	saturadas= ?
  //   WHERE id = ?`;
  //   await this.databaseService.query(sql, [body.fats, body.monoinsaturadas, body.poliinsaturadas, body.saturadas, idRecibo]);
  //   return this.returnReciboConcretoFuncion(idRecibo); // Retorna el recibo actualizado
  // }

  // async updateReciboObjetivoCarbs(idRecibo: number, body: {carbs, complejos, simples}) {
  //   const sql = `UPDATE recibo SET 
  //   carbs= ?, 	complejos= ?, 	simples= ?
  //   WHERE id = ?`;
  //   await this.databaseService.query(sql, [body.carbs, body.complejos, body.simples, idRecibo]);
  //   return this.returnReciboConcretoFuncion(idRecibo); // Retorna el recibo actualizado
  // }

  // async updateReciboObjetivoFiber(idRecibo: number, body: {fiber}) {
  //   const sql = `UPDATE recibo SET fiber= ? WHERE id = ?`;
  //   await this.databaseService.query(sql, [body.fiber, idRecibo]);
  //   return this.returnReciboConcretoFuncion(idRecibo); // Retorna el recibo actualizado
  // }



  
}