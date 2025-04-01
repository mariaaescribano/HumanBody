import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { alimentosComidosSkeleton } from 'src/dto/alimentos.dto';

@Injectable()
export class AlimentosComidosService {
  constructor(private readonly databaseService: DatabaseService) {}
  

  async createFunction(body:alimentosComidosSkeleton) 
  {
    if(body)
    {
      const sql = 'INSERT INTO `alimentoscomidos`(`idAlimento`, `nom`, `gramosTotales`, `calorias`, `predomina`) VALUES (?,?,?,?,?)';
      const params = [body.idAlimento, body.nom, body.gramosTotales, body.calorias, body.predomina];
      const result = await this.databaseService.query(sql, params);
      const insertId = result.insertId;
      return insertId;
    } 
    else
      throw new NotFoundException();
  }
 
  async returnAlimentoComido(idAlimento: number) 
  {
    const sql = 'SELECT * FROM alimentoscomidos WHERE id = ?';
    const result = await this.databaseService.query(sql, [idAlimento]);
    return result;
  }

  async deleteRejectedAlimentoComido(idAlimento: string) 
  {
    const sql = 'DELETE FROM alimentoscomidos WHERE id = ?';
    const result = await this.databaseService.query(sql, [idAlimento]);
    return result;
  }

}