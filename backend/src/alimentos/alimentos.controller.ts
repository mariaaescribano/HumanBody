import { Controller, Get, Post, Body, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
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
  async getNameExists(@Param('idMacro') idMacroStr: string, @Param('userNom') userNom: string) 
  {
    const idMacro = Number(idMacroStr); 
    if (isNaN(idMacro) && !userNom) {
      throw new BadRequestException("Parámetros inválidos.");
    }

    const foods = await this.alimentosService.findAllByIdMacro(idMacro);
    if(!foods)
    {
      throw new NotFoundException("Alimentos de macro no encontrados");
    }

    let alimentos = await this.getAlimentosOrdenPorFavsDeUser(foods, userNom)
    return alimentos;
  };

  @Get("macroPredomina/:idMacro")
  async macroPredomina(@Param('idMacro') idMacroStr: string) 
  {
    const idMacro = Number(idMacroStr); 
    const foods = await this.alimentosService.findAllByIdMacro(idMacro);
    if(!foods)
    {
      throw new NotFoundException("Alimentos de macro no encontrados");
    }
    return foods;
  };




  async getAlimentosOrdenPorFavsDeUser(foods:alimentosSkeleton[], userNom:string)
  {
    const dameUserFichaId = await this.usuariosService.dameUserFichaId(userNom);
    const user_alimentos_fav_ids = await this.fichaService.dameAlimentosFav(dameUserFichaId);
    let arrayNumeros: number[] = [];
    if (typeof user_alimentos_fav_ids === "string") 
    {
      arrayNumeros = user_alimentos_fav_ids.match(/\d+/g)?.map(Number) || [];
    }

    const devolverPorOrden: alimentosSkeleton[] = foods.map(food => ({
      id: food.id,
      nombre: food.nombre,
      calorias_100gr: food.calorias_100gr,
      gramos: food.gramos,
      recibo_id: food.recibo_id,
      predomina: food.predomina,
      es_fav_deUsu: arrayNumeros.includes(Number(food.id)) ? true : false,
    }));
    
    return { foods: devolverPorOrden };
  }




  @Get("userFoodMacro/:idMacro/:userNom")
  async getuserFoodMacro(@Param('idMacro') idMacro: number, @Param('userNom') userNom: string) 
  {
    if (isNaN(idMacro) && !userNom) {
      throw new BadRequestException("Parámetros inválidos.");
    }

    const foods = await this.alimentosService.findUserMacroFoods(idMacro, userNom);
    if(!foods)
    {
      throw new NotFoundException("Alimentos de macro no encontrados");
    }

    let esUser = await this.usuariosService.findByName(userNom)
    if(esUser==true)
    {
      let alimentos = await this.getAlimentosOrdenPorFavsDeUser(foods, userNom)
      return alimentos;
    }
    else 
      return foods;
   
  }


  @Get("favAlimentos/:userNom/:macro")
  async favAlimentosController(
   @Param('userNom') userNom: string,
   @Param('macro') macro: string)
  {
    if(userNom && macro)
    {
      let idFichaUser = await this.usuariosService.dameUserFichaId(userNom);
      if(idFichaUser)
      {
       let dameIdsAlimentosfav = await this.fichaService.dameAlimentosFav(idFichaUser)
        if(dameIdsAlimentosfav)
        {
          let alimentosFavObjetos = await this.alimentosService.damealimentosFavObjetos(dameIdsAlimentosfav, macro)
          return alimentosFavObjetos
        }
        else
          throw new NotFoundException();
      }
      else
        throw new NotFoundException();
    }
    else
      throw new BadRequestException();
  }



  @Get("search/:foodName/:userNom/:misCreaciones")
  async findMatchingFoodController(
   @Param('foodName') foodName: string,
   @Param('userNom') userNom: string,
   @Param('misCreaciones') misCreaciones: boolean) 
  {
    const foods = await this.alimentosService.findMatchingFood(foodName, misCreaciones, userNom);
    const userEsNutri = await this.usuariosService.findByName(userNom);
    if(foods)
    {
      if(!userEsNutri)
        return foods ;
      else
        return await this.getAlimentosOrdenPorFavsDeUser(foods, userNom);
    }
    else
      return [];
   
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

  @Get("alimentoIdRecibo/:alimentoNombre")
  async alimentoRecibo(@Param('alimentoNombre') alimentoNombre: string) 
  {
    return await this.alimentosService.getIdReciboSegunNombreAlimento(alimentoNombre);
  }

  @Get("alimentoId/:alimentoNombre")
  async alimentoId(@Param('alimentoNombre') alimentoNombre: string) 
  {
    return await this.alimentosService.getIdSegunNombreAlimento(alimentoNombre);
  }

  
}
