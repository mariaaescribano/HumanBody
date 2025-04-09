import { Controller, Get, Post, Body, Param, Delete, BadRequestException, NotFoundException, UploadedFile, UseInterceptors, Put } from '@nestjs/common';
import { MessageService } from './message.service';
import { messageSkeleton } from 'src/dto/message.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { convertFileToBase64, crearYGuardarTxt, descodeReturnFoto, getFecha } from 'src/GlobalHelperBack';
import { DiasService } from 'src/dias/dias.service';

@Controller('messages')  
export class MessageController {
  constructor(private readonly messageService: MessageService,
    private readonly diaService: DiasService
  ) {}

  @Post("create")
  @UseInterceptors(FileInterceptor('fotoFile'))
  async createMessage(
    @Body() body: messageSkeleton, 
    @UploadedFile() file: Express.Multer.File
  ) {
    try 
    {
      if (!file || file.size === 0) {
        body.foto = "";  
        let idMessage = await this.messageService.createMessageFunction(body);
      } 
      else 
      {
        let idMessage = await this.messageService.createMessageFunction(body);
        const base64String = await convertFileToBase64(file);
        const result = await crearYGuardarTxt(idMessage, base64String, true);
      }
      return "ok"
    } 
    catch (error) {
    
    }
    
  }

  @Put("changeToBlueTick/:idMessage")
  async updateMessages(
    @Param('idMessage') idMessage: string
  ) {
    return await this.messageService.changeToBlueTickFunction(idMessage);
  }


  @Get(":idDia/:idNutri/:userNom")
  async recuperateMessages(
    @Param('idDia') idDia: string,
    @Param('idNutri') idNutri: string,
    @Param('userNom') userNom: string,
  ) {
    return await this.messageService.recuperateMessagesFunction(idDia, idNutri, userNom);
  }

  @Get("messageFoto/:idMessage")
  async messageFoto(@Param('idMessage') idMessage: string) {
    return await descodeReturnFoto(idMessage+".txt", true);
  }

  // im a patient and i want to see the messages that my nutri sent me that i hadnt see
  @Get("notReadMessages/:userNom/:nutriId/:soy") // soy can only be 0 or 1(nutri)
  async notReadMessages(
    @Param('userNom') userNom: string,
    @Param('nutriId') nutriId: string,
    @Param('soy') soy: string) 
  {
    let iWantMessagesFrom = "0";
    if(soy =="0") //patient want to see the messages from the nutri
      iWantMessagesFrom="1"
    else
      iWantMessagesFrom="0"

    // take fecha de hoy and look if the day id of the messages fits
    let fecha =  await getFecha();
    // comprobate if exist a day with this date
    let existe = await this.diaService.existeDiaWithDate(fecha);
    if(existe)
      return await this.messageService.notReadMessagesFunction(userNom, nutriId, iWantMessagesFrom);
    else 
      return 0;
  }
  
}
