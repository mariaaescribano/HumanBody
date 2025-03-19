
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { realUser } from 'src/dto/usuarios.dto';
@Injectable()
export class UsuariosService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Obtener todas las personas
  async findAll() {
    return this.databaseService.query('SELECT * FROM usuarios');
  }

  async dameUserFichaId(userNom:string) {
    const sql = 'SELECT ficha_id FROM usuarios where nombre = ?';
    const params = [userNom];
    let id = await this.databaseService.query(sql,params);
    return id[0].ficha_id;
  }

  // Agregar una persona
  async createUser(body: realUser) {
    if(body)
    {
      const sql = 'INSERT INTO usuarios (nombre, contra, dias_ids, ficha_id, fecha_registro) VALUES (?, ?, ?, ?, ?)';
      const params = [body.nombre, body.contra, body.dias_ids, body.ficha_id, body.fecha_registro];
      return await this.databaseService.query(sql, params); 
    } 
    else
      return new NotFoundException();
  }

  // encontrar por nombre
  async findByName(nombre: string) {
    const sql = 'SELECT * FROM usuarios WHERE nombre = ?';
    const result = await this.databaseService.query(sql, [nombre]);
    return result.length > 0 ? true : false;
  }

  async findFichaIdByName(nombre: string) {
    // obtiene el id de la ficha
    const sql = 'SELECT ficha_id FROM usuarios WHERE nombre = ?';
    const result = await this.databaseService.query(sql, [nombre]);
    return parseInt(result[0].ficha_id, 10);
  }

  async editAvatarNombreFunction(userNom: string, name:string) {
    try 
    {
      const sql = `UPDATE usuarios SET nombre = ? WHERE nombre = ?`;
      await this.databaseService.query(sql, [ name, userNom]);
      return true;
    } 
    catch (error) {
      console.log("Error al actualizar la base de datos:", error);
      return false;
    }
  }












  async userValidCredentials(body: { nom: string; pass: string } ) 
  {
    if(body.nom && body.pass)
    {
      const sql = 'SELECT * FROM usuarios WHERE nombre = ? and contra = ?';
      const params = [body.nom, body.pass];
      const result = await this.databaseService.query(sql, params);
      return result.length > 0 ? true : false;
    }
    else
    // escribir la excepcion q queremos q el front recoja
      throw new NotFoundException();
  }













  

  async dameIdFichaDeUserName(userNom:string) 
  {
    const sql = 'SELECT	ficha_id FROM usuarios WHERE nombre = ?';
    const params = [userNom];
    const result = await this.databaseService.query(sql, params);
    return result[0].ficha_id;
  }
  




  // llamado por dias.service
  async dameDiasDeUserNom(nom: string ) 
  {
    if(nom)
    {
      const sql = 'SELECT dias_ids FROM usuarios WHERE nombre = ?';
      const params = [nom];
      const result = await this.databaseService.query(sql, params);
      return result;
    }  
    else
      throw new Error("En usuarios.service no llega el user nom");
    
  }

  async updateDiasUsuario( idDia: string, userNom:string ) 
  {
    const sql = `UPDATE usuarios SET dias_ids = CONCAT(dias_ids, ',', ?) WHERE nombre = ?`;
    await this.databaseService.query(sql, [ idDia, userNom]);
  }
  
}