import { Injectable } from '@nestjs/common';
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
    try {
      // Validar que el ID sea un número válido
      if (!dameIdFidelidad || isNaN(dameIdFidelidad)) {
        throw new Error("ID de fidelidad inválido o no definido.");
      }
  
      // Asegurar que los valores tengan un tipo adecuado
      const loHaSido = body.heSidoFiel ?? false;  // Si es undefined o null, usa false
      const why = body.porQue ?? "";  // Si es undefined o null, usa ""
      const forWhat = body.paraQue ?? "";  // Si es undefined o null, usa ""
  
      // Mostrar los valores antes de la consulta para depuración
      console.log("Parámetros enviados a SQL:", { loHaSido, why, forWhat, dameIdFidelidad });
  
      const sql = `UPDATE fidelidad SET loHaSido = ?, why = ?, forWhat = ? WHERE id = ?`;
      await this.databaseService.query(sql, [loHaSido, why, forWhat, dameIdFidelidad]);
  
      return true;
    } catch (error) {
      console.log("Error al actualizar la base de datos:", error);
      return false;
    }
  }


  async getFidelidadPorIdDia(idFidelidad:number) 
  {
    try
    {
      const sql = 'SELECT * from fidelidad where id = ?';
      const params = [idFidelidad];
      const result = await this.databaseService.query(sql, params);
      console.log(result)
      return result;
    }
    catch (error) {
      console.log("Error al actualizar la base de datos:", error);
      return false;
    }
  }

  
  
  
}