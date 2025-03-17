'use client';
// Chakra imports
import {
    Box,
  Button,
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
import  { alimentoMacroMealView, finalMealCard, mealSkeleton } from '../../../../../backend/src/dto/meal.dto';
import { dameDatosDelRecibo, ObjectIsNull, redirigirSiNoHayUserNom } from '@/GlobalHelper';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import FinalMealCard from '@/components/designMeal/FinalMealCard';

export default function LastPage() 
{
  // ESTRATEGIA
  // coger datos de SS
  // crear cartitas 

  // todos los meals pero con sus datos para show off
  const [meals, setmeals] = useState<finalMealCard[]>([]);


  // IMPLEMENTACION
  // 0: coge el array de ss
  useEffect(() => 
  {
    redirigirSiNoHayUserNom()
    const datosGuardados = sessionStorage.getItem('arrayMeals');
    if(datosGuardados)
    {
        const arrayRecuperado = JSON.parse(datosGuardados);
        gestionaArrayMeals(arrayRecuperado);
    }
  }, []);


  // 1: las separa para meterlos en los nuevos tipos de datos
  const gestionaArrayMeals = (mealsNumber:mealSkeleton[]) =>
  {
    let guarda = [];

    for(let i=0; i< mealsNumber.length; i++)
    {
        
        let dameProte = gestionaMacro(mealsNumber[i].fuenteProte, mealsNumber[i].gramosFuenteProte, mealsNumber[i].proteTotal)
        let dameFats = gestionaMacro(mealsNumber[i].fuenteFat, mealsNumber[i].gramosFuenteFat, mealsNumber[i].fatTotal)
        let dameCarbs = gestionaMacro(mealsNumber[i].fuenteCarbs, mealsNumber[i].gramosFuenteCarbs, mealsNumber[i].carbsTotal)
        let dameFiber = gestionaMacro(mealsNumber[i].fuenteFibra, mealsNumber[i].gramosFuenteFibra, mealsNumber[i].fibraTotal)
        let mealObject: finalMealCard =
        {
            prote:dameProte,
            fats:dameFats,
            carbs:dameCarbs,
            fiber:dameFiber,
            pieData: [Number(dameProte.gramosFuente) ?? 0, Number(dameFats.gramosFuente) ?? 0, Number(dameCarbs.gramosFuente) ?? 0, Number(dameFiber.gramosFuente) ?? 0],
            totalCalories:mealsNumber[i].caloriasSelected
        };
        guarda.push(mealObject)
    }  
    setmeals(guarda)
  };


  const gestionaMacro = (fuenteProte:string, gramosFuenteProte:string, proteTotal:string) =>
  {
      let mealObject: alimentoMacroMealView =
      {
          nombreFuente:fuenteProte,
          gramosMacro:proteTotal,
          gramosFuente:gramosFuenteProte
      };
      return mealObject
  };

  const borrar = () =>
  {
    sessionStorage.removeItem("arrayMeals")
    location.href = "./start"
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
                <Text fontSize="2xl" fontWeight="700">YOUR DESIGNED MEAL</Text>
            }/>

            <Button bg="red.100" onClick={borrar} boxShadow="0px 2px 4px rgba(0, 0, 0, 0.2)">Delete</Button>
       
            
            {/* tarjetas de meals */}
            <Box ml={{ base: "30px", md: "0px" }} mb="60px" w={{ base: "100%", md: "auto" }}>
                <SimpleGrid columns={{ base: 1, md: 1 }} w="100%">
                     {/* colocacion interna tarjetas de meals */}
                    {meals.map((item, index) => (
                        <CustomCard key={index} hijo={
                            <FinalMealCard meal={item} index={index}/>
                        }></CustomCard>
                    ))}
              </SimpleGrid>
            </Box>
        </Flex>
      }
      {meals.length == 0 &&<PurpleSpinner></PurpleSpinner>}
    </>);

}
