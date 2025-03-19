
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { realUser } from 'src/dto/usuarios.dto';
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
      return result.length > 0 ? true : false;
    }
    else
    // escribir la excepcion q queremos q el front recoja
      throw new NotFoundException();
  }

  
}