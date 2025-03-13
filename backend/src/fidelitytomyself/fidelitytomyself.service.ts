import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { fidelidadCompleteSkeleton } from 'src/dto/fidelidad.dto';


@Injectable()
export class fidelitytomyselfService {
  constructor(private readonly databaseService: DatabaseService
  ) {}

  async createFidelity() 
  {
    const sql = 'INSERT INTO `fidelitytomyself`( `estoy`, 	`estare` ,	`objetivo` ,	`acercarme` ,	`autosaboteo`, `trustmyself`) VALUES (?,?,?,?,?,?)';
    const params = ["", "", "", "", "", ""];
    const result = await this.databaseService.query(sql, params);
    const idRecibo = result.insertId;
    return idRecibo;
  }

  async actualizaFidelity(idFidelidad: number, body: fidelidadCompleteSkeleton) 
  {
    if(idFidelidad && body)
    {
      const sql = `UPDATE fidelitytomyself SET estoy=?, estare=?, objetivo=?, acercarme=?, autosaboteo=?, trustmyself=?  WHERE id = ?`;
      await this.databaseService.query(sql, [body.estoy, body.estare, body.objetivo, body.acercarme, body.autosaboteo, body.trustmyself , idFidelidad]);
      return true;
    }
    else
      throw new NotFoundException();
  }


  async getDatos(idFidelidad:number): Promise<fidelidadCompleteSkeleton | null> 
  {
    try
    {
      const sql = 'SELECT * from fidelitytomyself  where id = ?';
      const params = [idFidelidad];
      const result = await this.databaseService.query(sql, params);
      return result;
    }
    catch (error) {
      console.log("Error al actualizar la base de datos:", error);
      return null;
    }
  }

  
  
  
}