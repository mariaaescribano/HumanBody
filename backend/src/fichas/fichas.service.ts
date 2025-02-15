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
}