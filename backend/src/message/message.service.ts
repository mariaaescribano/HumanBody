import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { messageSkeleton } from 'src/dto/message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createMessageFunction(body: messageSkeleton)
  {
    if(!body)
        throw new NotFoundException();

    const sql = `
        INSERT INTO messages 
        (userNom, nutriId, diaId, sendBy, message, foto, vistoPorLaOtraPersona, hora, designameal ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [body.userNom, body.nutriId, body.diaId, body.sendBy,
        body.message, body.foto, body.vistoPorLaOtraPersona, body.hora, body.designameal
    ];
    try {
        const result = await this.databaseService.query(sql, params);
        return result.insertId;
    } catch (error) {
        console.error("Database insert error:", error);
        throw new InternalServerErrorException("Failed to insert meal data.");
    }
  }


  async recuperateMessagesFunction(idDia:string, idNutri:string, userNom:string)
  {
    if(!idDia || !idNutri || !userNom)
        throw new NotFoundException();

    const sql = `SELECT * from messages where diaId = ? and nutriId = ? and userNom = ?`;
    const params = [idDia, idNutri, userNom];

    try {
        const result = await this.databaseService.query(sql, params);
        return result;
    } catch (error) {
        console.error("Database insert error:", error);
        throw new InternalServerErrorException("Failed to insert meal data.");
    }
  }


  async notReadMessagesFunction(userNom: string, nutriId: string, iWantMessagesFrom: string) {
    if (!iWantMessagesFrom || !nutriId || !userNom) {
      throw new NotFoundException("Required parameters are missing.");
    }
  
    const sql = `
      SELECT COUNT(*) as count
      FROM messages 
      WHERE sendBy = ? AND nutriId = ? AND userNom = ? AND vistoPorLaOtraPersona = ?;
    `;
    
    const params = [iWantMessagesFrom, nutriId, userNom, 0];
  
    try {
      const result = await this.databaseService.query(sql, params);
  
      // Assuming the result is an array and the first element has the count
      const count = result[0]?.count || 0; // Default to 0 if no result found
      return count;
    } catch (error) {
      console.error("Database query error:", error);
      throw new InternalServerErrorException("Failed to retrieve unread messages.");
    }
  }

  async changeToBlueTickFunction(idMessage: string) {
    if(!idMessage)
      throw new NotFoundException();

    const sql = 'UPDATE messages SET vistoPorLaOtraPersona = 1 WHERE id = ?';
    const result = await this.databaseService.query(sql, [idMessage]);
    // if (result.affectedRows > 0) {
    //   console.log('ok');
    // } else {
    //   console.log('No ok');
    // }
  }

}