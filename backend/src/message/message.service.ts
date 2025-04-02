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
        (userNom, nutriId, diaId, sendBy, message, foto, vistoPorLaOtraPersona) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [body.userNom, body.nutriId, body.diaId, body.sendBy,
        body.message, body.foto, body.vistoPorLaOtraPersona
    ];
    console.log(body)
    try {
        const result = await this.databaseService.query(sql, params);
        console.log("ok")
        return "ok"
    } catch (error) {
        console.error("Database insert error:", error);
        throw new InternalServerErrorException("Failed to insert meal data.");
    }
  }
  
}