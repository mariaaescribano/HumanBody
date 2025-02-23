import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { realUser } from 'src/dto/usuarios.dto';
@Injectable()
export class UsuariosService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Obtener todas las personas
  async findAll() {
    const sql = 'SELECT * FROM usuarios';
    return await this.databaseService.query(sql);
  }

  // Agregar una persona
  async createUser(body: realUser) {
    const sql = 'INSERT INTO usuarios (nombre, contra, dias_ids, ficha_id, fecha_registro) VALUES (?, ?, ?, ?, ?)';
    const params = [body.nombre, body.contra, body.dias_ids, body.ficha_id, body.fecha_registro];
    return await this.databaseService.query(sql, params);
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

  async userValidCredentials(body: { nom: string; pass: string } ) {
    const sql = 'SELECT * FROM usuarios WHERE nombre = ? and contra = ?';
    const params = [body.nom, body.pass];
    const result = await this.databaseService.query(sql, params);
    return result.length > 0 ? true : false;
  }
}