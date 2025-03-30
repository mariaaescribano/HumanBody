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
import  { alimentoMacroMealView, designamealSkeleton, finalMealCard, mealSkeleton } from '../../../../../backend/src/dto/meal.dto';
import { API_URL, dameDatosDelRecibo, ObjectIsNull, redirigirSiNoHayUserNom } from '@/GlobalHelper';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import FinalMealCard from '@/components/designMeal/FinalMealCard';
import InputField from '@/components/global/random/InputField';
import axios from 'axios';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';
import SuccessErrorMessage from '@/components/global/message/SuccessErrorMessage';

export default function LastPage() 
{
  // ESTRATEGIA
  // coger datos de SS
  // crear cartitas 

  // todos los meals pero con sus datos para show off
  const [meals, setmeals] = useState<designamealSkeleton[]>([]);
  //btnPressed--> 0: nothing, 1: spinner, 2:deleted perfectly, 3: error
  const [btnPressed, setbtnPressed] = useState<number>(0);
  const mensajeSuccess = useRef<string>("");
//////////////////////////////////////////////////////////////////////

  // IMPLEMENTACION
  // 0: coge el array de ss
  useEffect(() => {
    redirigirSiNoHayUserNom();

    // need to take all the objects that has meal in the SS
    let idmeals = getMealObjectsFromSessionStorage();
    if(idmeals.length>0)
      getMealsObjects(idmeals)// need to make calls to BD
  
     // location.href='./start'
  }, []);

  function getMealObjectsFromSessionStorage(): any[] {
    const results: any[] = [];
  
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      
      // Check if the key matches the pattern "meal" followed by a number
      if (key && /^meal\d+$/.test(key)) { 
        try {
          const item = JSON.parse(sessionStorage.getItem(key) || "null");
          if (item) {
            results.push({ key, value: item });
          }
        } catch (error) {
          console.error(`Error parsing sessionStorage item ${key}:`, error);
        }
      }
    }
    return results;
  }

  const getMealsObjects = async (idmeals:{ key: string, value: any }[]) =>
  {
    if(idmeals && idmeals.length>0)
    {
      let guarda:designamealSkeleton[] = [];
      for (let i = 0; i < idmeals.length; i++)
      {
        let meal = await getConcretMeal(idmeals[i].value);
        let mealSalva:designamealSkeleton = meal;

        //get objects
        let dameProte = gestionaMacro(mealSalva.fuenteProte,mealSalva.gramosFuenteProte, mealSalva.proteTotal)
        let dameFats = gestionaMacro(mealSalva.fuenteFat, mealSalva.gramosFuenteFat, mealSalva.fatTotal)
        let dameCarbs = gestionaMacro(mealSalva.fuenteCarbs, mealSalva.gramosFuenteCarbs, mealSalva.carbsTotal)
        let dameFiber = gestionaMacro(mealSalva.fuenteFibra, mealSalva.gramosFuenteFibra, mealSalva.fibraTotal)
        //save objects
        mealSalva.prote=dameProte;
        mealSalva.fats=dameFats;
        mealSalva.carbs=dameCarbs;
        mealSalva.fiber=dameFiber;
        //get pie data
        mealSalva.pieData = [Number(dameProte.gramosFuente) ?? 0, Number(dameFats.gramosFuente) ?? 0, Number(dameCarbs.gramosFuente) ?? 0, Number(dameFiber.gramosFuente) ?? 0];
        // save activity and caloriesNeeded
        if (!sessionStorage.getItem("actividad")) {
          sessionStorage.setItem("actividad", meal.actividad);
        }
        if (!sessionStorage.getItem("caloriasNecesitadas")) {
          sessionStorage.setItem("caloriasNecesitadas", meal.caloriesNeeded);
        }

        guarda.push(mealSalva)
      }
      setmeals(guarda)
    }
    else
      location.href='./start'
    
  };

  const getConcretMeal = async (idmeal:string) =>
  {
    try{
      const response = await axios.get(
          `${API_URL}/designameal/meal/${idmeal}`,
          {
            headers: {
                'Content-Type': 'application/json'
            },
          }
      );
      if(response.data != null)
      {
       return response.data;
      }
    }
    catch (error) 
    {
      console.error('Error fetching data:', error);
    }
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



  // deleting a designmeaobject from back (also needs to be deleted from ss)
  const borrar = async () =>
  {
    try{
      setbtnPressed(1)
      const response = await axios.delete(
          `${API_URL}/designameal/delete/${sessionStorage.getItem("userNom")}`,
          {
            headers: {
                'Content-Type': 'application/json'
            },
          }
      );
        if(response.data == "ok") // es q se ha eliminado
        {
          setbtnPressed(2)
          mensajeSuccess.current = "Meals deleted correctly"
          sessionStorage.removeItem("DesignAMeal");
          deleteMealObjectsFromSessionStorage()
          const timer = setTimeout(() => {
            setbtnPressed(0)
            location.href = "./start"
          }, 3000);
          return () => clearTimeout(timer); 
          
        }
      }
      catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  function deleteMealObjectsFromSessionStorage(): void {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      
      // Check if the key matches the pattern "meal" followed by a number
      if (key && /^meal\d+$/.test(key)) {
        try {
          // Delete the item from sessionStorage
          sessionStorage.removeItem(key);
        } catch (error) {
          console.error(`Error removing sessionStorage item ${key}:`, error);
        }
      }
    }
  }
  




  return (
    <>
      {meals.length >0 && 
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

            {btnPressed == 3 && <Box mb="10px">
              <PopUpErrorMessage title={''} texto={'Please, try again later.'}></PopUpErrorMessage></Box>} 
            
            {/* titulo */}
            <CustomCard mt="0px" hijo={
              <Text fontSize="2xl" fontWeight="700">YOUR DESIGNED MEAL</Text>
            }/>

            <Button bg="red.100" mt="5px" disabled={btnPressed==1? true:false} onClick={borrar} boxShadow="0px 2px 4px rgba(0, 0, 0, 0.2)">
              <Text>Delete</Text>
              {btnPressed == 1 && 
              <Spinner
                size="sm"
                ml={4}
                color="white"
              />}
            </Button>

            {btnPressed == 2 && <SuccessErrorMessage title={ mensajeSuccess.current } status={'success'}></SuccessErrorMessage>}
            

            {/* actividad */}
            <CustomCard mt="20px" hijo={
              <Flex direction="column" mb="4px">
                  <InputField
                  mb="20px"
                  id="first"
                  disabled={true}
                  value={sessionStorage.getItem("actividad")}
                  placeholder="Run 6km / Work all day long / Party with friends / ..."
                  label="Today's activity where I will put my heart into:"
                  textAlign={"center"}
                  />
                  <InputField
                  mb="0px"
                  id="second"
                  disabled={true}
                  value={sessionStorage.getItem("caloriasNecesitadas")+" kcal"}
                  label="Calories I will need to healthily fulfill the activity:"
                  textAlign={"center"}
                  />
              </Flex>
          }/>
            
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
