import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { diasSkeleton } from 'src/dto/dias.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { FidelidadService } from 'src/fidelidad/fidelidad.service';


@Injectable()
export class DiasService {
  constructor(private readonly databaseService: DatabaseService, 
    private readonly usuariosService: UsuariosService,
    private readonly fidelidadService: FidelidadService
  ) {}

  async createDia(reciboId: number, fecha:string, userNom:string) 
  {
    const idFidelidad = await this.fidelidadService.createFidelidad();
    const sql = 'INSERT INTO `dias`(`fidelidad_id`, `recibo_id`, `calorias_total`, `alimentos_id`, `fecha` ) VALUES (?,?,?,?, ?)';
    const params = [idFidelidad, reciboId, "0", "", fecha];
    const result = await this.databaseService.query(sql, params);
    const insertId = result.insertId;
    await this.usuariosService.updateDiasUsuario(insertId, userNom);
    return insertId;
  }

  async updateDiaAlimentosCalorias(idRecibo: number, alimentoId:string, calorias:string) {
    const sql = `UPDATE dias SET calorias_total = ?, alimentos_id = CONCAT(alimentos_id, '-', ?) WHERE id = ?`;
    await this.databaseService.query(sql, [ calorias, alimentoId, idRecibo]);
    return true;
  }


  async convertirCadenaANumeros(cadena: any): Promise<number[]> 
  {
    if(cadena)
    { 
      let numeros: number[] = [];
      let num = "";
    
      for (let i = 0; i < cadena[0].dias_ids.length; i++) {
        const caracter = cadena[0].dias_ids[i];
    
        // Si el carácter es una coma, significa que hemos llegado al final de un número
        if (caracter === ',') {
          // Convertimos el número temporal a un entero y lo agregamos al array
          if (num.trim() !== '') {  // Comprobamos que el número temporal no esté vacío
            const numero = parseInt(num, 10);
            if (!isNaN(numero)) {
              numeros.push(numero); // Solo agregamos si es un número válido
            } 
          }
          num = ""; // Reiniciamos el número temporal
        } else {
          // Si no es una coma, agregamos el carácter al número temporal
          num += caracter;
        }
      }
    
      // Después del ciclo, puede quedar un número pendiente al final
      if (num.trim() !== '') {
        const numero = parseInt(num, 10);
        if (!isNaN(numero)) {
          numeros.push(numero);
        }
      }
      return numeros;
    }  
    else
      throw new Error("Cadena de dias no llega a la función de conversión")
   
  };
  
  async getDiaDeUser(userNom: string) 
  {
    if(userNom)
    {
      try 
      {
        let dameDiasIdsDeUser = await this.usuariosService.dameDiasDeUserNom(userNom);
        if(dameDiasIdsDeUser)
        {
          let idEnNumberArray = await this.convertirCadenaANumeros(dameDiasIdsDeUser);
          return idEnNumberArray;
        }
      } 
      catch (error) 
      {
        console.log("Error cogiendo dias de usuario:", error);
      }
      
    }
    else
      throw new NotFoundException();
   
  }



  async diaPorId (idDia: number) {
    const sql = 'SELECT * FROM dias WHERE id = ?';
    const params = [idDia];
    const result = await this.databaseService.query(sql, params);
    return result;
  }


  async dameIdFidelidadDeIdDia (idDia: number) {
    if(idDia)
    {
      const sql = 'SELECT fidelidad_id FROM dias WHERE id = ?';
      const params = [idDia];
      const result = await this.databaseService.query(sql, params);
      return result[0].fidelidad_id;
    }
    else
      throw new NotFoundException();
  }


  


}