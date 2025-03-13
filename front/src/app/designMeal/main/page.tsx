'use client';
// Chakra imports
import {
    Box,
  Flex,
  FormLabel,
  Select,
  SimpleGrid,
  Spinner,
  Text,

} from '@chakra-ui/react';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import CustomCard from '@/components/global/cards/CustomCard';
import BarraMenu from '@/components/global/BarraMenu';
import TitleCard from '@/components/global/cards/TitleCard';
import MainCards from '@/components/designMeal/MainCards';
import  { mealSkeleton } from '../../../../../backend/src/dto/meal.dto';
import { dameDatosDelRecibo, ObjectIsNull, redirigirSiNoHayUserNom } from '@/GlobalHelper';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';

export default function DesignMealMain() 
{
  // ESTRATEGIA
  // coge num meals de ss
  // coge calorias objetivo de ss
  // coge recibo objetivo de ss (lo trae todo de bd)
  // divide las calorias en el num de meals
  // divide los macros en num de meals
  // muestra en pantalla (en cada cartita) lo q deberia de tener cada comida
  // guarda los datos en ss  

  const [meals, setmeals] = useState<mealSkeleton[]>([]);
  const [nextDisabled, setnextDisabled] = useState<boolean>(false);


  // IMPLEMENTACION
  // 0: coge num meals de ss
  useEffect(() => 
  {
    redirigirSiNoHayUserNom()
    
    // si hay num de meals, es q acaba de empezar
    // se crea lista de mealSkeleton vacios
    let mealsNumber = Number(sessionStorage.getItem("meals"))
    if(mealsNumber)
    {
      setnextDisabled(true)
      encargateReparticion(mealsNumber);
    }
    // si hay arrayMeals, es q ya esta avanzando en el diseño
    else
    {
      const datosGuardados = sessionStorage.getItem('arrayMeals');
      if(datosGuardados)
      {
        const arrayRecuperado = JSON.parse(datosGuardados);
        setmeals(arrayRecuperado)

        // miramos q todos los datos esten rellenos para ver si podemos darle a Next
        comprobarTodosDatosLlenos(arrayRecuperado);
      }
    }
  
  }, []);



  // 1: coge calorias y recibo de usuario
  // lo divide segun el num de meals q desa planificar
  // lo asigna uno a uno
  const encargateReparticion = async (mealsNumber:number) =>
  {
    let guarda = [];
    let caloriasRepartidas = divideCalorias(mealsNumber);
    let reparteMacros = await divideMacros(mealsNumber);

    if(caloriasRepartidas && reparteMacros)
    {
      for(let i=0; i< mealsNumber; i++)
      {
        let newMeal: mealSkeleton =
        {
          relleno: false,
          caloriasTotal: caloriasRepartidas?.toString(),
          proteTotal: reparteMacros[0],
          fuenteProte: "",
          carbsTotal: reparteMacros[2],
          fuenteCarbs: "",
          fatTotal: reparteMacros[1],
          fuenteFat: "",
          fibraTotal: reparteMacros[3],
          fuenteFibra: "",
          gramosFuenteProte: '',
          gramosFuenteCarbs: '',
          gramosFuenteFat: '',
          gramosFuenteFibra: ''
        };
        guarda.push(newMeal)
      } 
      setmeals(guarda)
      sessionStorage.setItem('arrayMeals', JSON.stringify(guarda));
      // borra el meals de ss para q no repita la operacion
      sessionStorage.removeItem("meals")
    } 
    else
      location.href = "../login/login"  
   
  };

  const divideCalorias = (mealsNumber:number) =>
  {
    let calorias = Number(sessionStorage.getItem("caloriasObjetivo"))
    if(calorias)
    {
      let reparte = Math.round(calorias/mealsNumber);
      return reparte;
    }
    // si faltan datos, se vuelve a login
    else
      location.href = "../login/login"  
  };

  const divideMacros = async (mealsNumber:number) =>
  {
    let idRecibo = Number(sessionStorage.getItem("reciboObjetivo"))
    if(idRecibo)
    {
      let recibo = await dameDatosDelRecibo(idRecibo)
      console.log(recibo)
      if(!ObjectIsNull(recibo))
      {
        // se divide cada macro
        let proteDivision = Math.round(Number(recibo.prote) / mealsNumber).toString();
        let fatDivision =  Math.round(Number(recibo.grasas) / mealsNumber).toString();
        let carbsDivision = Math.round(Number(recibo.carbs) / mealsNumber).toString();
        let fibraDivision = Math.round(Number(recibo.fibra) / mealsNumber).toString();
        return [proteDivision, fatDivision, carbsDivision, fibraDivision] 
      } 
    }  
    // si faltan datos, se vuelve a login
    else
      location.href = "../login/login" 
  };


  const comprobarTodosDatosLlenos = (arrayRecuperado: mealSkeleton[]) =>
  {
    let llenos = true;
    for(let i=0; i< arrayRecuperado.length; i++)
    {
      if(arrayRecuperado[i].relleno == false)
        llenos = false;
    }
    if(llenos == true)
      setnextDisabled(false)
    else
      setnextDisabled(true)
  };





  // si el usuario quiere ir a atras, simplemente se borra lo q habia en ss
  const goBack = () =>
  {
    sessionStorage.removeItem("arrayMeals")
    sessionStorage.removeItem("meals")
    location.href = "./start";
  };




  return (
    <>
      {meals.length !== 0 && 
        <Flex
            direction="column"
            align="center"
            bg="purple.100"
            w="100%"
            h="100%"
            justify="center"
            p="20px"
            minH="100vh"
            position={"relative"}
        >

            <BarraMenu></BarraMenu>
            
            {/* titulo */}
            <CustomCard mt="0px" hijo={
                <TitleCard title={'DESIGN YOUR MEAL II'} 
                firstBtnText={'Delete & Go back'} goback={goBack} 
                secondBtnText={'Save & Next'} letsgo={()=> location.href = "./lastPage"} btnDesactivado={nextDisabled} />
            }/>
            
            {/* tarjetas de meals */}
            {/* si solo hay uno, se pondra en el medio */}
            <Box ml={{ base: "30px", md: "0px" }} mt={{ base: "10px", md: "10px" }} mb="60px">
            {meals.length === 1 ? (
              <Flex justify="center">
                <Box>
                  <CustomCard
                    mt="0px"
                    hijo={<MainCards meal={meals[0]} index={1} />}
                  />
                </Box>
              </Flex>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: "10px", md: "20px" }}>
                {meals.map((item, index) => (
                  <Box key={index}>
                    <CustomCard mt="10px" mb="0px"
                      hijo={<MainCards meal={item} index={index} />}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            )}
            </Box>
        </Flex>
      }
      {meals.length == 0 &&<PurpleSpinner></PurpleSpinner>}
    </>);

}
