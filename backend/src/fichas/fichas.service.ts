import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { fichaSkeleton } from 'src/dto/fichas.dto';
import { NotFoundError } from 'rxjs';
import { createUserSkeleton } from 'src/dto/usuarios.dto';


@Injectable()
export class FichasService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createFicha(ficha: fichaSkeleton) 
  {
    if(ficha)
    {   
      const sql = 'INSERT INTO `ficha`(`peso`, `altura`, `actividad`, `calorias_objetivo`, `objetivo`, `recibo_id`, `genero`, `edad` , `fidelitytomyself_id`) VALUES (?,?,?,?,?,?,?,?, ?)';
      const params = [ficha.peso, ficha.altura, ficha.nivel_actividad, ficha.calorias_objetivo, ficha.objetivo, ficha.reciboId, ficha.genero, ficha.edad, ficha.fidelitytomyselfId];
      const result = await this.databaseService.query(sql, params);
      const idRecibo = result.insertId;
      return idRecibo;
    }
    else
      throw new NotFoundException();
  }

  async findReciboCaloriasDeUserFicha(idFicha: number) 
  {
    const sql = 'SELECT calorias_objetivo, recibo_id FROM ficha WHERE id = ?';
    const result = await this.databaseService.query(sql, [idFicha]);
    return result;
  }

  async actualizarFotoPerfilRuta(fichaObjId:number, newUserNom:string) 
  {
    const sql = 'UPDATE ficha SET perfilPic  = ? WHERE id = ?;';
    const result = await this.databaseService.query(sql, [ newUserNom+".txt", fichaObjId]);
  }

  async getFichaFunction(idFicha: number) 
  {
    const sql = 'SELECT perfilPic, peso, altura, actividad , calorias_objetivo, objetivo, recibo_id, genero, edad FROM ficha WHERE id = ?';
    const result = await this.databaseService.query(sql, [idFicha]);
    return result;
  }

  async getFotoPerfil(idFicha: number) 
  {
    const sql = 'SELECT perfilPic FROM ficha WHERE id = ?';
    const result = await this.databaseService.query(sql, [idFicha]);
    return result;
  }



  async updateAlimFav(idFicha:number, idAlimento:number) 
  {
    try 
    {
      const sql = `UPDATE ficha SET alimentos_fav_id = CONCAT(alimentos_fav_id, ',', ?) WHERE id = ?`;
      await this.databaseService.query(sql, [ idAlimento, idFicha]);
      return true;
    } 
    catch (error) {
      console.log("Error al actualizar la base de datos:", error);
      return false;
    }
  }


  async updatePerfilPic(perfilPic:string, fichaObjId:number) 
  {
    try 
    {
      const sql = `UPDATE ficha SET perfilPic = ? WHERE id = ?`;
      await this.databaseService.query(sql, [ perfilPic, fichaObjId]);
      return true;
    } 
    catch (error) {
      console.log("Error al actualizar la base de datos:", error);
      return false;
    }
  }


  async dameAlimentosFav(fichaId) 
  {
    const sql = 'SELECT alimentos_fav_id from ficha where id = ?';
    const params = [fichaId];
    const result = await this.databaseService.query(sql, params);
    return result[0].alimentos_fav_id;
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

  public async dameIdFidelidad(idFicha: number) {
    const sql = 'SELECT fidelitytomyself_id from ficha where id = ?';
    const params = [idFicha];
    const result = await this.databaseService.query(sql, params);
    return result[0].fidelitytomyself_id;
  }

  async updateFichaUser(dameIdFichaDeUserNameNum: number, ficha: fichaSkeleton) {
    try {
        const sql = `UPDATE ficha 
                     SET peso=?, 
                         altura=?, 
                         actividad=?, 
                         calorias_objetivo=?, 
                         objetivo=?, 
                         genero=?, 
                         edad=?  
                     WHERE id = ?`;

        await this.databaseService.query(sql, [
            ficha.peso,
            ficha.altura,
            ficha.nivel_actividad,
            ficha.calorias_objetivo,
            ficha.objetivo,
            ficha.genero,
            ficha.edad,
            dameIdFichaDeUserNameNum
        ]);

        return true;
    } catch (error) {
        console.log("Error al actualizar la base de datos:", error);
        return false;
    }
  }
  
}