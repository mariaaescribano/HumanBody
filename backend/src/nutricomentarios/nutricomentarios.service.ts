
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { realUser } from 'src/dto/usuarios.dto';
import { nutriComentarios } from 'src/dto/nutri.dto';
@Injectable()
export class NutricomentariosService {
  constructor(private readonly databaseService: DatabaseService) {}

  async addRowForUserByNutri(nutriId:number, userNom:string) {
    const sql = 'INSERT INTO nutricomentarios (idNutri ,	patientNom ,	datosFicha ,	prote	) VALUES (?, ?, ?, ?)';
    const params = [nutriId, userNom, "", ""];
    await this.databaseService.query(sql, params);
  }

  async nutriWriteCommentFunction(
    campo: nutriComentarios, 
    userNom: string,
    nutriId: string,
    body: any
  ) {
    const sql = `UPDATE nutricomentarios SET ${campo} = ? WHERE idNutri = ? AND patientNom = ?`;
    const params = [body?.comentario, nutriId, userNom];
  
    try {
      await this.databaseService.query(sql, params);
    } catch (error) {
    }
  }

  async nutriRecomiendaFunction(
    userNom: string,
    nutriId: string,
    idAlimento: string
  ) {
    if (!nutriId || !userNom || !idAlimento) {
      throw new NotFoundException();
    }

    // Ensure the parameters are passed in the correct order:
    const sql = `
      UPDATE nutricomentarios 
      SET nutriRecomienda = TRIM(BOTH ',' FROM CONCAT(
        COALESCE(nutriRecomienda, ''), ',', ?
      )) 
      WHERE idNutri = ? AND patientNom = ?
      AND FIND_IN_SET(?, nutriRecomienda) = 0;
    `;

    const params = [idAlimento, nutriId, userNom, idAlimento]; // Ensure correct parameter order
    await this.databaseService.query(sql, params);
  }

  
  async patientRejectNutriRecomiendaFunction(
    userNom: string,
    nutriId: string,
    idAlimento: string
  ) {
    if (!nutriId || !userNom || !idAlimento) {
      throw new NotFoundException();
    }
  
    // Remove a specific alimento id from nutriRecomienda
    const sql = `
      UPDATE nutricomentarios 
      SET nutriRecomienda = TRIM(BOTH ',' FROM REPLACE(
        CONCAT(',', COALESCE(nutriRecomienda, ''), ','), 
        CONCAT(',', ?, ','), 
        ','
      )) 
      WHERE idNutri = ? AND patientNom = ?
      AND FIND_IN_SET(?, nutriRecomienda) > 0;
    `;
  
    const params = [idAlimento, nutriId, userNom, idAlimento]; 
    try {
      const result = await this.databaseService.query(sql, params);
      if(result)
        return ("ok");
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }
  
  


  async nutriGetCommentFunction(
    campo: nutriComentarios, 
    userNom: string,
    nutriId: string
  ) {
    const sql = `SELECT ${campo} from nutricomentarios WHERE idNutri = ? AND patientNom = ?`;
    const params = [nutriId, userNom];
  
    try {
      const result = await this.databaseService.query(sql, params);
      return result[0];
    } catch (error) {
    }
  }

  async borrarColumna(userNom: string) 
  {
    const sql = 'DELETE FROM nutricomentarios WHERE patientNom = ?';
    const result = await this.databaseService.query(sql, [userNom]);
    return result;
  }


  async nutriRecomiendaGetAlimentosFunction(userNom: string, nutriId:string) 
  {
    const sql = 'SELECT nutriRecomienda FROM nutricomentarios WHERE patientNom = ? and idNutri =?';
    const result = await this.databaseService.query(sql, [userNom, nutriId]);
    return result;
  }

  

}