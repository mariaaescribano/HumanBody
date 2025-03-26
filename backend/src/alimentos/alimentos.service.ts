import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { alimentosSkeleton } from 'src/dto/alimentos.dto';

@Injectable()
export class AlimentosService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllByIdMacro(idMacro: number) 
  {
    const sql = 'SELECT * FROM alimento WHERE predomina = ? LIMIT 30';
    const result = await this.databaseService.query(sql, [idMacro]);
    return result;
  }

  async findUserMacroFoods(idMacro: number, userNom:string) 
  {
    const sql = 'SELECT * FROM alimento WHERE predomina = ? and userNom = ? LIMIT 30';
    const result = await this.databaseService.query(sql, [idMacro, userNom]);
    return result;
  }


  async findMatchingFood(foodName: string, misCreaciones:boolean, userNom:string) {
    if(foodName && misCreaciones)
    { 
      if(misCreaciones === true || misCreaciones === "true")
      {
        const sql = 'SELECT * FROM alimento WHERE nombre LIKE ? AND userNom IS NOT NULL AND userNom = ? LIMIT 30';
        const result = await this.databaseService.query(sql, [`%${foodName}%`, userNom]);
        return result;        
      } 
      else
      {
        const sql = 'SELECT * FROM alimento WHERE nombre LIKE ? LIMIT 30';
        const result = await this.databaseService.query(sql, [`%${foodName}%`]);
        return result;
      } 
    }
    else
      throw new BadRequestException();
  }
  
  async createAlimento(body: alimentosSkeleton, userNom:string) {
    const sql = 'INSERT INTO alimento (nombre, calorias_100gr, gramos, recibo_id, predomina, userNom) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [body.nombre, body.calorias_100gr, body.gramos, body.recibo_id, body.predomina, userNom];
    await this.databaseService.query(sql, params);
    return "Ok";
  }

  async returnAlimentoConcretoFuncion(idAlimento: number) {
    const sql = 'SELECT * FROM alimento WHERE id = ?';
    const result = await this.databaseService.query(sql, [idAlimento]);
    return result;
  }

  async deleteAlimentoFuncion(idAlimento: number, userNom: string) {
    const sql = 'DELETE FROM alimento WHERE userNom = ? and id = ?';
    const result = await this.databaseService.query(sql, [userNom, idAlimento]);
    return result;
  }


  /// conseguir alimentos fav de un macronutriente ///
  async damealimentosFavObjetos(dameIdsAlimentosfav: string, macro: string) {
    let idsAlimFavs = await this.deStringAArrayNumeros(dameIdsAlimentosfav);
  
    let guarda: any[] = []; 
    for (let i = 0; i < idsAlimFavs.length; i++) 
    {
      const sql = 'SELECT * FROM alimento WHERE id = ? and predomina = ?';
      const result = await this.databaseService.query(sql, [idsAlimFavs[i], macro]);
      if(result[0]!= null && result[0] != undefined)
        guarda.push(result[0]);
    }
  
    return guarda;
  }
  
  async deStringAArrayNumeros(input: string) {
    let result: number[] = [];
    let num = 0;
    let isNegative = false;
    
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      
      if (char === '-') {
        isNegative = true;
      } else if (char === ',' || i === input.length - 1) {
        if (i === input.length - 1 && char !== ',') {
          num = num * 10 + parseInt(char);
        }
        result.push(isNegative ? -num : num);
        num = 0;
        isNegative = false;
      } else {
        num = num * 10 + parseInt(char);
      }
    }
    return result;
  }
  /// end conseguir alimentos fav de un macronutriente ///
  
}