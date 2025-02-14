import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { createUser } from '../dto/usuarios.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Obtener todas las personas
  async findAll() {
    const sql = 'SELECT * FROM usuarios';
    return await this.databaseService.query(sql);
  }

  // Agregar una persona
  async createUser(body: createUser) {
    const sql = 'INSERT INTO usuarios (nombre, contra, peso, altura, nivel_actividad, calorias_objetivo, objetivo, recibo, edad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [body.nombre, body.contra, body.peso, body.altura, body.nivel_actividad, body.calorias_objetivo, body.objetivo, body.recibo, body.genero, body.edad];
    return await this.databaseService.query(sql, params);
  }
}