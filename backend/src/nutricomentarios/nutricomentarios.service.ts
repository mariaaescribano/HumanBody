
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
    console.log(body, nutriId, userNom)
    const sql = `UPDATE nutricomentarios SET ${campo} = ? WHERE idNutri = ? AND patientNom = ?`;
    const params = [body?.comentario, nutriId, userNom];
  
    try {
      await this.databaseService.query(sql, params);
    } catch (error) {
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

}