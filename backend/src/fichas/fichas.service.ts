import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { fichaSkeleton } from 'src/dto/fichas.dto';


@Injectable()
export class FichasService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createFicha(ficha: fichaSkeleton) 
  {
    const sql = 'INSERT INTO `ficha`(`peso`, `altura`, `actividad`, `calorias_objetivo`, `objetivo`, `recibo_id`, `genero`, `edad`) VALUES (?,?,?,?,?,?,?,?)';
    const params = [ficha.peso, ficha.altura, ficha.nivel_actividad, ficha.calorias_objetivo, ficha.objetivo, ficha.reciboId, ficha.genero, ficha.edad];
    const result = await this.databaseService.query(sql, params);
    const idRecibo = result.insertId;
    return idRecibo;
  }

  async findReciboCaloriasDeUserFicha(idFicha: number) 
  {
    const sql = 'SELECT calorias_objetivo, recibo_id FROM ficha WHERE id = ?';
    const result = await this.databaseService.query(sql, [idFicha]);
    return result;
  }

  async updateAlimFav(idFicha:number, idAlimento:number) 
  {
    try 
    {
      console.log("aaaaaaaaaa")
      const sql = `UPDATE ficha SET alimentos_fav_id = CONCAT(alimentos_fav_id, ',', ?) WHERE id = ?`;
      await this.databaseService.query(sql, [ idAlimento, idFicha]);
      return true;
    } 
    catch (error) {
      console.log("Error al actualizar la base de datos:", error);
      return false;
    }
  }

  async removeAlimFav(idFicha: number, idAlimento: number) {
    try {
      const sql = `
        UPDATE ficha 
        SET alimentos_fav_id = TRIM(BOTH ',' FROM REPLACE(
          CONCAT(',', alimentos_fav_id, ','), 
          CONCAT(',', ?, ','), 
          ','
        )) 
        WHERE id = ?;
      `;
      await this.databaseService.query(sql, [idAlimento, idFicha]);
      return true;
    } catch (error) {
      console.log("Error al actualizar la base de datos:", error);
      return false;
    }
  }
  
  
}