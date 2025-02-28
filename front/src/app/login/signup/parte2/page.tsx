'use client';
// Chakra imports
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Icon,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import { API_URL, exerciseFrequencyList, StringIsNull, objectivesList, ObjectIsNull, getTamanyoPantalla } from '../../../../../GlobalHelper';
import { createUserSkeleton } from '../../../../../../backend/src/dto/usuarios.dto';
import { MdArrowBack, MdHdrStrong } from 'react-icons/md';
import PurpleSpinner from '@/components/global/random/Spinner';
import MeryTooltip from '@/components/global/random/MeryToolTip';
import CustomCard from '@/components/global/cards/CustomCard';
import TitleCard from '@/components/signin/TitleCard';
import { CaloryIcon } from '@/components/icons/CaloryIcon';

export default function SignUp2() 
{
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [user, setUser] = useState<createUserSkeleton | null>(null);
  const [screenSize, setscreenSize] = useState<string>("");
  const [activityLevelIndex, setactivityLevelIndex] = useState<number>(-1);
  const objectiveIndex = useRef<number>(0);

  const TMB = useRef<string>("");
  const caloriesWithLifeStyle = useRef<string>("");
  const caloriesWithObjective = useRef<string>("");

  useEffect(() => 
  {
    const userStr = sessionStorage.getItem("user");
    getTamanyoPantalla(setscreenSize)
    if (userStr) 
    {
    
      const user = JSON.parse(userStr); 
      // coger indices de listas en vez del valor value
      let activityLevelIndex = exerciseFrequencyList.findIndex(item => item.value === user.nivel_actividad);
      setactivityLevelIndex(activityLevelIndex);
      objectiveIndex.current = objectivesList.findIndex(item => item.value === user.objetivo);

      let calorias = calculaCalorias(user.peso, user.altura, user.edad, user.genero, activityLevelIndex);

      const userWithCalories :createUserSkeleton = {
        nombre:user.nombre,
        contra:user.contra,
        peso:user.peso,
        altura:user.altura,
        nivel_actividad:user.nivel_actividad,
        calorias_objetivo:calorias,
        objetivo:user.objetivo,
        recibo: NaN,
        genero: user.genero,
        edad:user.edad
      };

      setUser(userWithCalories)
      sessionStorage.clear();
      sessionStorage.setItem("user", JSON.stringify(userWithCalories));
      sessionStorage.setItem("objectiveIndex", JSON.stringify(objectiveIndex.current));
    }
    else
      location.href = '../signup/parte1';
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculaCalorias = (peso:string, altura:string, edad:string, genero:string, activityLevelIndex:number) =>
  { 
    let TMBtotal = 0;

    const pesoNumber = peso ? parseFloat(peso) : 0; 
    const alturaNumber = altura ? parseFloat(altura) : 0;
    const edadNumber = edad ? parseFloat(edad) : 0;

    if(genero == "Woman")
    { 
      TMBtotal=(10*pesoNumber)+(6.25*alturaNumber)-(5*edadNumber)-161;
    }
    else if(genero == "Man")
    { 
      TMBtotal=(10*pesoNumber)+(6.25*alturaNumber)-(5*edadNumber)+5;
    }
    TMB.current =  TMBtotal.toString();

    let dameCantidadExercise = cantidadExercise(activityLevelIndex);  
    let multiplicaCalLifeStyle =  Math.round(dameCantidadExercise * TMBtotal);
    caloriesWithLifeStyle.current = multiplicaCalLifeStyle.toString();
    
    if(objectiveIndex.current == 0)
    { 
      caloriesWithObjective.current= (multiplicaCalLifeStyle-400).toString();
    }
    if(objectiveIndex.current == 1)
      { 
        caloriesWithObjective.current= (multiplicaCalLifeStyle+300).toString();
      }
      if(objectiveIndex.current == 2)
        { 
          caloriesWithObjective.current= caloriesWithLifeStyle.current;
        }

        return caloriesWithObjective.current;
  };

  const cantidadExercise = (activityLevelIndex:number) =>
  {
    let dev=0;
    if(activityLevelIndex == 0)
    { 
      dev = 1.2;
    }
    if(activityLevelIndex == 1)
      { 
        dev = 1.375;
      }
      if(activityLevelIndex == 2)
        { 
          dev = 1.55;
        }
        if(activityLevelIndex == 3)
          { 
            dev = 1.725;
          }
          if(activityLevelIndex == 4)
            { 
              dev = 1.9;
            }
            return dev;
  };
    

  const letsgo = () =>
  {
    location.href = "../signup/parte3";
  };
    

  return (
    <Flex
    direction="column"
    align="center"
    bg="purple.100"
    w="100%"
    h="100%"
    justify="center"
    minH="100vh"
    position={"relative"}
>
    {!ObjectIsNull(user) && user != null && !StringIsNull(user.calorias_objetivo) && activityLevelIndex!= -1 &&
    <CustomCard mb={"10px"} hijo={ 
      <TitleCard title={`${user.nombre}, is this what you want?`} letsgo={letsgo} goback={() => location.href = "../login/parte1"} tooltip={''}></TitleCard>} >
    </CustomCard>}

    {!ObjectIsNull(user) && user != null && !StringIsNull(user.calorias_objetivo) && activityLevelIndex!= -1 &&
    <CustomCard  mb={"100px"} hijo={ 
      <>
        <Box w="100%" borderBottom="2px solid black" my="20px" />


        <Flex direction="column" w="100%" >
            {[
                { label: "Gender", price:  user.genero },
                { label: "Weight", price: user.peso +" kg" },
                { label: "Height", price: user.altura+" cm" },
                { label: "Activity level", price:  exerciseFrequencyList[activityLevelIndex].label },
                { label: "Objective", price:  objectivesList[objectiveIndex.current].label }

            ].map((item, index) => (
              <Flex key={index} align="center" w="100%" fontSize="lg">
                  {/* Item Name */}
                  <Text flexShrink={0}>{item.label}</Text>
                  
                  {/* Dotted Line (Flexible) */}
                  <Text flex="1" mx="8px" whiteSpace="nowrap" overflow="hidden">
                      ........................................................................................................................................................
                  </Text>
              
                  {/* Price */}
                  <Text flexShrink={0}>{item.price}</Text>
              </Flex>
          
            ))}

          <Box w="100%" borderBottom="2px solid black" my="20px" />

          {/* Total large screen */}
          {screenSize!= "" && (screenSize == "md" || screenSize == "xl") && 
          <Flex direction="column" w="100%">
          {[
              { label: "Your basal calories are", price: `${TMB.current} kcal`, tooltip: "This are the calories that you need to exist :)" },
              { label: "With your life style would change to", price: `${caloriesWithLifeStyle.current} kcal`, tooltip: "This are the calories that you need to have your lifestyle." },
              { label: "With your objective would change to", price: `${caloriesWithObjective.current} kcal`, tooltip: "This are the calories that you need to obtain your goal." }
          ].map((item, index) => (
              <Flex
                  key={index}
                  align="center"
                  w="100%"
                  fontSize={{ base: "md", sm: "lg" }} // Cambia el tamaño de la fuente en pantallas pequeñas
    
                  direction={{ base: "column", sm: "row" }} // En pantallas pequeñas, los elementos se apilan verticalmente, en pantallas grandes horizontalmente
                  justify="start" // Alinea todo a la izquierda
              >
                  {/* Información del título y tooltip alineados a la izquierda */}
                  <HStack justify="start" gap="5px" align="start">
                      <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                          {item.label}
                      </Text>
                      <MeryTooltip texto={item.tooltip} />
                  </HStack>

                  {/* Dotted Line (Flexible) */}
                  <Text
                      flex="1"
                      mx="8px"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      display={{ base: "none", sm: "block" }} // Oculta la línea punteada en pantallas pequeñas
                  >
                      ........................................................................................................................................................
                  </Text>

                  {/* Price */}
                  <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                      {item.price}
                  </Text>
              </Flex>
          ))}
          </Flex>}

          {/* Total small screen */}
          {screenSize!= "" && screenSize == "sm" && 
          <Flex direction="column" w="100%" mb="10px">
          {[
              { label: "Your basal calories are", price: `${TMB.current} kcal`, tooltip: "This are the calories that you need to exist :)" },
              { label: "With your life style would change to", price: `${caloriesWithLifeStyle.current} kcal`, tooltip: "This are the calories that you need to have your lifestyle." },
              { label: "With your objective would change to", price: `${caloriesWithObjective.current} kcal`, tooltip: "This are the calories that you need to obtain your goal." }
          ].map((item, index) => (
              <VStack
                  key={index}
                  align="center"
                  w="100%"
                  fontSize={{ base: "md", sm: "lg" }}
                  mb="20px"
                  justify="center" 
              >
                  <HStack gap="5px">
                      <Text>
                          {item.label}
                      </Text>
                      <MeryTooltip texto={item.tooltip} />
                  </HStack>
                  <Text  align="center">
                      {item.price}
                  </Text>
              </VStack>
          ))}
          </Flex>}


          {/* Horizontal Line */}
          <Box w="100%" borderBottom="2px solid black" my="20px" />
          <Flex justify="space-between" w="100%" fontSize="xl" fontWeight={"bold"} mb="20px">
            <HStack>
              <CaloryIcon />
              <Text>TOTAL CALORIES </Text>
            </HStack>
              <Text>{caloriesWithObjective.current} kcal</Text>
          </Flex>

        
        </Flex>
      </>} >
    </CustomCard>}

        

    {user == null && activityLevelIndex == -1 &&
      <PurpleSpinner></PurpleSpinner>}
</Flex>
);

}
