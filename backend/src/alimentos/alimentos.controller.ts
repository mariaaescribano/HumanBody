import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AlimentosService } from './alimentos.service';
import { alimentosSkeleton } from 'src/dto/alimentos.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { FichasService } from 'src/fichas/fichas.service';

@Controller('alimentos')  // Ruta base para este controlador
export class AlimentosController {
  constructor(private readonly alimentosService: AlimentosService,
    private readonly usuariosService: UsuariosService,
    private readonly fichaService: FichasService
  ) {}

  @Get("macroPredomina/:idMacro/:userNom")
  async getNameExists(@Param('idMacro') idMacro: number, @Param('userNom') userNom: string) {
    const foods = await this.alimentosService.findAllByIdMacro(idMacro);
    const dameUserFichaId = await this.usuariosService.dameUserFichaId(userNom)
    const user_alimentos_fav_ids = await this.fichaService.dameAlimentosFav(dameUserFichaId)
    const arrayNumeros = user_alimentos_fav_ids.match(/\d+/g).map(Number);

    // pone antes los alimentos de dentro de lista de favs
    let devolverPorOrden: alimentosSkeleton[] = [];

    for(let i=0; i< foods.length; i++)
    {
      let objeto: alimentosSkeleton = 
      {
        id: foods[i].id,
        nombre:foods[i].nombre,
        calorias_100gr:foods[i].calorias_100gr,
        gramos:foods[i].gramos,
        recibo_id:foods[i].recibo_id,
        predomina:foods[i].predomina
      };
      if(arrayNumeros.includes(foods[i].id))
      {
        objeto.es_fav_deUsu = true;
      } 
      else
      {
        objeto.es_fav_deUsu = false;
      } 
      devolverPorOrden.push(objeto)
    }   

    return { foods: devolverPorOrden };
  }

  @Get("userFoodMacro/:idMacro/:userNom")
  async getuserFoodMacro(@Param('idMacro') idMacro: number, @Param('userNom') userNom: string) {
    const foods = await this.alimentosService.findUserMacroFoods(idMacro, userNom);
    return { foods: foods };
  }

  @Get("search/:foodName")
  async findMatchingFoodController(@Param('foodName') foodName: string) {
    const foods = await this.alimentosService.findMatchingFood(foodName);
    return { foods: foods };
  }

  @Post("createAlimento/:userNom")
  async createAlimento(@Body() body: alimentosSkeleton, @Param('userNom') userNom: string) {
    return await this.alimentosService.createAlimento(body, userNom);
  }

  @Get("alimento/:idAlimento")
  async returnAlimentoConcreto(@Param('idAlimento') idAlimento: number) {
    const alimento = await this.alimentosService.returnAlimentoConcretoFuncion(idAlimento);
    return { alimento: alimento };
  }

  @Delete("deleteAlimento/:idAlimento/:userNom")
  async deleteAlimento(@Param('idAlimento') idAlimento: number, @Param('userNom') userNom: string) {
    const seHaEliminado = await this.alimentosService.deleteAlimentoFuncion(idAlimento, userNom);
    return seHaEliminado ? true : false;
  }

  
}
