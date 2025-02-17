import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { fichaSkeleton } from 'src/dto/fichas.dto';


@Injectable()
export class AlimentosService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllByIdMacro(idMacro: number) 
  {
    const sql = 'SELECT * FROM alimento WHERE predomina = ?';
    const result = await this.databaseService.query(sql, [idMacro]);
    return result;
  }
 
}