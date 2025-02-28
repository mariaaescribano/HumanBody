import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../Database/database.service';
import { diasSkeleton } from 'src/dto/dias.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';


@Injectable()
export class DiasService {
  constructor(private readonly databaseService: DatabaseService, 
    private readonly usuariosService: UsuariosService
  ) {}

  async createDia(reciboId: number, fecha:string, userNom:string) 
  {
    const sql = 'INSERT INTO `dias`(`fidelidad_id`, `recibo_id`, `calorias_total`, `alimentos_id`, `fecha` ) VALUES (?,?,?,?, ?)';
    const params = [-1, reciboId, "0", "", fecha];
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











  // get Dia Anterior de User
  async convertirCadenaANumeros(cadena: any): Promise<number[]> {
    let numeros: number[] = [];
    let num="";

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

  async getDiaAnteriorDeUser(userNom: string, fecha:string) 
  {
    // coge el dias_ids del usuario userNom
    let dameDiasIdsDeUser = await this.usuariosService.dameDiasDeUserNom(userNom);
    // pasa ese string a un array de numeros
    let idEnNumberArray = await this.convertirCadenaANumeros(dameDiasIdsDeUser);

    // va id por id cogiendo la fecha y guardandola
    let fechasEncontradas:any = [];
    for(let i=0; i< idEnNumberArray.length; i++)
    {
      const sql = 'SELECT fecha FROM dias WHERE id = ?';
      const params = [idEnNumberArray[i]];
      let result:any = await this.databaseService.query(sql, params);
      fechasEncontradas.push(result[0].fecha)
    }  
    
    // hace una busqueda para...
    let fechaPasadaMasCercana = await this.obtenerFechaPasadaMasCercana(fecha, fechasEncontradas);
    
    // con el resultado, coge el id de la lista inicial
    let index = fechasEncontradas.indexOf(fechaPasadaMasCercana);

    // como se han hecho en el mismo orden
    // el id de fechasEncontradas equivale al id de idEnNumberArray
    let diaId = idEnNumberArray[index];

    // se devuelve el id del dia de la fecha mas cercana a fecha (param)
    return diaId; 
  }

  async obtenerFechaPasadaMasCercana(fechaActual: string, fechas: any[]) {
    // Convertimos la fecha actual a un objeto Date
    const fechaHoy = new Date(fechaActual);
    
    let fechasEnDate:any = [];
    for(let i=0; i< fechas.length; i++)
    {
      let fecha = new Date(fechas[i]);
      if (!isNaN(fecha.getTime()))
        fechasEnDate.push(fecha)
    }

    // Encontramos la fecha pasada más cercana a la fecha actual
    const fechaMasCercana = fechasEnDate.reduce((fechaCercana, fecha) => {
      return (fechaHoy.getTime() - fecha.getTime()) < (fechaHoy.getTime() - fechaCercana.getTime()) ? fecha : fechaCercana;
    });

    const year = fechaMasCercana.getFullYear();
    const month = String(fechaMasCercana.getMonth() + 1).padStart(2, '0'); // Meses empiezan desde 0
    const day = String(fechaMasCercana.getDate()).padStart(2, '0'); // Asegura el formato de 2 dígitos

    return `${year}-${month}-${day}`;
  }
  // end get Dia Anterior de User


}