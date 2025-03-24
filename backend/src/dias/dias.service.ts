import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { diasSkeleton } from 'src/dto/dias.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { FidelidadService } from 'src/fidelidad/fidelidad.service';
import { convertirCadenaANumeros } from 'src/GlobalHelperBack';


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

  
  async getDiaDeUser(userNom: string) 
  {
    if(userNom)
    {
      try 
      {
        let dameDiasIdsDeUser = await this.usuariosService.dameDiasDeUserNom(userNom);
        if(dameDiasIdsDeUser)
        {
          let idEnNumberArray = await convertirCadenaANumeros(dameDiasIdsDeUser[0].dias_ids);
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

  async getAllDiasDeUnaFecha (fecha: string) 
  {
    const sql = 'SELECT id FROM dias WHERE fecha = ?';
    const params = [fecha];
    const result = await this.databaseService.query(sql, params);
    return result;
  }

  async getDiaConcreto (idDia: number) 
  {
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