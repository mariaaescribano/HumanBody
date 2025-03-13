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
        console.log(mealsNumber[i])
        let dameProte = gestionaMacro(mealsNumber[i].fuenteProte, mealsNumber[i].gramosFuenteProte, mealsNumber[i].proteTotal)
        let dameFats = gestionaMacro(mealsNumber[i].fuenteFat, mealsNumber[i].gramosFuenteFat, mealsNumber[i].fatTotal)
        let dameCarbs = gestionaMacro(mealsNumber[i].fuenteCarbs, mealsNumber[i].gramosFuenteCarbs, mealsNumber[i].carbsTotal)
        //let dameFiber = gestionaMacro(mealsNumber[i].fuenteProte, mealsNumber[i].gramosFuenteProte, mealsNumber[i].proteTotal)

        let mealObject: finalMealCard =
        {
            prote:dameProte,
            fats:dameFats,
            carbs:dameCarbs,
            //fiber:alimentoMacroMealView;
            pieData: [Number(dameProte.gramosMacro), Number(dameFats.gramosMacro), Number(dameCarbs.gramosMacro)],
            totalCalories:mealsNumber[i].caloriasSelected
        };
        guarda.push(mealObject)
    }  
    console.log(guarda)
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
            
            {/* tarjetas de meals */}
            <Box ml={{ base: "30px", md: "0px" }} mb="60px">
                <SimpleGrid columns={{ base: 1, md: 1 }} w="100%">
                     {/* colocacion interna tarjetas de meals */}
                    {meals.map((item, index) => (
                        <CustomCard hijo={
                            <FinalMealCard meal={item} key={index} index={index}/>
                        }></CustomCard>
                    ))}
              </SimpleGrid>
            </Box>
        </Flex>
      }
      {meals.length == 0 &&<PurpleSpinner></PurpleSpinner>}
    </>);

}
