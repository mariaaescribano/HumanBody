import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2';

@Injectable()
export class DatabaseService {
  private connection;

  constructor() {
    this.connection = mysql.createPool({
      host: 'localhost',  // Cambia a la configuración de tu base de datos
      user: 'root',       // Usuario de la base de datos
      password: '', // Contraseña de la base de datos
      database: 'humanbody',  // Nombre de tu base de datos
      waitForConnections: true,
      connectionLimit: 10,  // Limita el número de conexiones
      queueLimit: 0,
    });
  }

  // Método para ejecutar queries SQL directamente
  async query(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.execute(sql, params, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }
}