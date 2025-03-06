import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { fichaSkeleton } from 'src/dto/fichas.dto';
import { fidelidadSkeleton } from 'src/dto/fidelidad.dto';


@Injectable()
export class FidelidadService {
  constructor(private readonly databaseService: DatabaseService
  ) {}

  public async createFidelidad() 
  {
    const sql = 'INSERT INTO `fidelidad`(`loHaSido`, `why`, `forWhat`) VALUES (?,?,?)';
    const params = [false, "", ""];
    const result = await this.databaseService.query(sql, params);
    const idRecibo = result.insertId;
    return idRecibo;
  }

  async actualizaFidelidad(dameIdFidelidad: number, body: fidelidadSkeleton) {
    if(dameIdFidelidad && body)
    {
      const sql = `UPDATE fidelidad SET loHaSido = ?, why = ?, forWhat = ? WHERE id = ?`;
      await this.databaseService.query(sql, [body.heSidoFiel, body.porQue, body.paraQue, dameIdFidelidad]);
      return true;
    }
    else
      throw new NotFoundException();
  }


  async getFidelidadPorIdDia(idFidelidad:number) 
  {
    try
    {
      const sql = 'SELECT * from fidelidad where id = ?';
      const params = [idFidelidad];
      const result = await this.databaseService.query(sql, params);
      return result;
    }
    catch (error) {
      console.log("Error al actualizar la base de datos:", error);
      return false;
    }
  }

  
  
  
}