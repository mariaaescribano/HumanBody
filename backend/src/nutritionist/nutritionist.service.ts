
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { realUser } from 'src/dto/usuarios.dto';
import { removeNameFromConcatenatedList } from 'src/GlobalHelperBack';
@Injectable()
export class NutritionistService {
  constructor(private readonly databaseService: DatabaseService) {}

  async userValidCredentials(body: { nom: string; pass: string } ) 
  {
    if(body.nom && body.pass)
    {
      const sql = 'SELECT * FROM nutritionist WHERE nom = ? and contra = ?';
      const params = [body.nom, body.pass];
      const result = await this.databaseService.query(sql, params);
      return result;
    }
    else
      throw new NotFoundException();
  }

  async dameIdNutriFunction(nutriNom:string) 
  {
    if(nutriNom)
    {
      const sql = 'SELECT id FROM nutritionist WHERE nom = ?';
      const params = [nutriNom];
      const result = await this.databaseService.query(sql, params);
      return result[0].id;
    }
    else
      throw new NotFoundException();
  }

  async allNutrisFunction() 
  {
    const sql = 'SELECT * FROM nutritionist ';
    const result = await this.databaseService.query(sql);
    return result;
  }

  async addSolicitudDeContrato(userNom: string, nutriId: number) {
    try {
      const sql = `
        UPDATE nutritionist  
        SET solicitudesDeContrato = 
          CASE 
            WHEN solicitudesDeContrato IS NULL OR solicitudesDeContrato = '' 
            THEN ? 
            ELSE TRIM(BOTH ',' FROM REPLACE(
              CONCAT(',', solicitudesDeContrato, ','), 
              CONCAT(',', ?, ','), 
              ','
            )) 
          END
        WHERE id = ?;
      `;
  
      const result = await this.databaseService.query(sql, [userNom, userNom, nutriId]);
      return true;
    } catch (error) {
      console.log("Error al actualizar la base de datos:", error);
      return false;
    }
  }


  // take the users's names from the request and cut it
  async solicitudesDeContratoFunction(nutriNom: string) 
  {
    const sql = `SELECT solicitudesDeContrato FROM nutritionist WHERE nom=?`;
    const result = await this.databaseService.query(sql, [nutriNom]);
  
    const nombresConcatenados = result[0]?.solicitudesDeContrato; 
    let nombresArray: string[] = [];
  
    if (nombresConcatenados) {
      let nombre = "";
      for (let i = 0; i < nombresConcatenados.length; i++) {
        const char = nombresConcatenados[i];
        if (char === ",") {
          if (nombre.trim()) { 
            nombresArray.push(nombre.trim());
          }
          nombre = ""; 
        } else {
          nombre += char;
        }
      }
      if (nombre.trim()) {
        nombresArray.push(nombre.trim());
      }
    }
    return nombresArray; 
  }
  

  async userHaHechoSolicitudFunction(userNom: string) 
  {
    const sql = `SELECT * FROM nutritionist WHERE CONCAT(',', solicitudesDeContrato, ',') LIKE CONCAT('%,', ?, ',%')`;
    const result = await this.databaseService.query(sql, [userNom]);
    return result;
  }

  async dameNutriFunction(nutriNom: string) 
  {
    const sql = `SELECT * FROM nutritionist WHERE nom=?`;
    const result = await this.databaseService.query(sql, [nutriNom]);
    return result;
  }


  async nutriFunction(nutriId: number) 
  {
    const sql = `SELECT * FROM nutritionist WHERE id=?`;
    const result = await this.databaseService.query(sql, [nutriId]);
    return result;
  }

  async deleteUserNomFromRequests(nutriId: number, userNom: string) 
  {
    const sql = `SELECT solicitudesDeContrato FROM nutritionist WHERE id=?`;
    const result = await this.databaseService.query(sql, [nutriId]);  
    let updateSolicitudes;
  
    if (result.length > 0) {
      let restoSolicitudes = await removeNameFromConcatenatedList(result[0].solicitudesDeContrato, userNom);
      // Convertimos el array de nuevo en string
      let updateSolicitudes = "";
      for (let i = 0; i < restoSolicitudes.length; i++) {
        if (i > 0) {
          updateSolicitudes += ","; // Add comma separator except for the first element
        }
        updateSolicitudes += restoSolicitudes[i];
      }

    } else {
      updateSolicitudes = "";
    }
  
    const sql2 = `UPDATE nutritionist SET solicitudesDeContrato = ? WHERE id = ?;`;
    const result2 = await this.databaseService.query(sql2, [updateSolicitudes, nutriId]);
  }


  async updatePerfilPic(nutriNom: string) 
  {
    const sql = `UPDATE nutritionist SET perfilPic = ? WHERE nom = ?;`;
    const result = await this.databaseService.query(sql, [nutriNom+".txt", nutriNom]);
    return result;
  }

  async editNombreFunction(oldUserNom: string, newUserNom: string) 
  {
    const sql = `UPDATE nutritionist SET nom = ? , perfilPic=? WHERE nom = ?;`;
    const result = await this.databaseService.query(sql, [newUserNom, newUserNom+".txt", oldUserNom]);
    return result;
  }

  async editEmailDescripFunction(nutriNom: string, body:{ descrip: string, email:string }) 
  {
    const sql = `UPDATE nutritionist SET description = ?, email = ? WHERE nom = ?;`;
    const result = await this.databaseService.query(sql, [body.descrip, body.email, nutriNom]);
    return result;
  }

}