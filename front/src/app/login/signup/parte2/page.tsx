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
import { API_URL, exerciseFrequencyList, StringIsNull, objectivesList, ObjectIsNull, getTamanyoPantalla } from '../../../../GlobalHelper';
import { createUserSkeleton } from '../../../../../../backend/src/dto/usuarios.dto';
import { MdArrowBack, MdHdrStrong } from 'react-icons/md';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import MeryTooltip from '@/components/global/random/MeryToolTip';
import CustomCard from '@/components/global/cards/CustomCard';
import TitleCard from '@/components/global/cards/TitleCard';
import { CaloryIcon } from '@/components/icons/CaloryIcon';
import UserPersonalData from '@/components/miPerfil/UserPersonalData';

export default function SignUp2() 
{
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [user, setUser] = useState<createUserSkeleton | null>(null);
  const [screenSize, setscreenSize] = useState<string>("");
  const [btnPulsado, setbtnPulsado] = useState<boolean>(false)
  const [activityLevelIndex, setactivityLevelIndex] = useState<number>(-1);
  const objectiveIndex = useRef<number>(0);

  const TMB = useRef<string>("");
  const caloriesWithLifeStyle = useRef<string>("");
  const caloriesWithObjective = useRef<string>("");

  useEffect(() => 
  {
    const userStr = sessionStorage.getItem("user");
    getTamanyoPantalla(setscreenSize)
    if (!userStr)  
      location.href = '../signup/parte1';

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculaCalorias = (peso:string, altura:string, edad:string, genero:string, activityLevelIndex:number) =>
  { 
    const pesoNumber = peso ? parseFloat(peso) : 0; 
    const alturaNumber = altura ? parseFloat(altura) : 0;
    const edadNumber = edad ? parseFloat(edad) : 0;

    const TMBtotal = genero === 'Woman'
    ? (10 * pesoNumber) + (6.25 * alturaNumber) - (5 * edadNumber) - 161
    : (10 * pesoNumber) + (6.25 * alturaNumber) - (5 * edadNumber) + 5;
    TMB.current = TMBtotal.toString();

    let dameCantidadExercise = cantidadExercise(activityLevelIndex);  
    let multiplicaCalLifeStyle =  Math.round(dameCantidadExercise * TMBtotal);
    caloriesWithLifeStyle.current = multiplicaCalLifeStyle.toString();
    
    caloriesWithObjective.current = (objectiveIndex.current === 0)
    ? (multiplicaCalLifeStyle - 400).toString()
    : (objectiveIndex.current === 1)
    ? (multiplicaCalLifeStyle + 300).toString()
    : multiplicaCalLifeStyle.toString();

    return caloriesWithObjective.current;
  };

  // se crea un array con activityLevelIndex y se accede a ella usando el index pasado
  const cantidadExercise = (activityLevelIndex: number) => [1.2, 1.375, 1.55, 1.725, 1.9][activityLevelIndex] || 1.2;
    

  const letsgo = () =>
  {
    setbtnPulsado(true)
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
      <TitleCard title={`${user.nombre}, is this what you want?`} firstBtnIcon={<Icon as={MdArrowBack}/>} secondBtnIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m536-84-56-56 142-142-340-340-142 142-56-56 56-58-56-56 84-84-56-58 56-56 58 56 84-84 56 56 58-56 56 56-142 142 340 340 142-142 56 56-56 58 56 56-84 84 56 58-56 56-58-56-84 84-56-56-58 56Z"/></svg>} 
      btnDisabled={btnPulsado} letsgo={letsgo} goback={() => location.href = "../signup/parte1"} tooltip={''} firstBtnText={"No, go back"} secondBtnText={"Yes, let's go!"}></TitleCard>} >
    </CustomCard>}

    {!ObjectIsNull(user) && user != null && !StringIsNull(user.calorias_objetivo) && activityLevelIndex!= -1 &&
    <UserPersonalData user={user} editando={false} activityLevelIndex={activityLevelIndex} objectiveIndex={objectiveIndex.current} TMB={TMB.current} 
    caloriesWithLifeStyle={caloriesWithLifeStyle.current} caloriesWithObjective={caloriesWithObjective.current} screenSize={screenSize} />}

        

    {user == null && activityLevelIndex == -1 &&
      <PurpleSpinner></PurpleSpinner>}
</Flex>
);

}
