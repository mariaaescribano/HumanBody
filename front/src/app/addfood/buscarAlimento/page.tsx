'use client';
// Chakra imports
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  IconButton,
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
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import SelectSignIn from '@/components/signin/SelectSignIn';
import PopUpMessage from '@/components/global/PopUpMessage';
import PopUpErrorMessage from '@/components/global/PopUpErrorMessage';
import PurpleSpinner from '@/components/global/Spinner';
import CustomCard from '@/components/global/CustomCard';
import { API_URL, getInternetDateParts } from '../../../../GlobalHelper';
import { CircProgressMini } from '@/components/myday/CircProgressMini';
import MacroCalView from '@/components/myday/MacroCalView';
import ElementoPrimero from '@/components/myday/ElementoPrimero';
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import Buscador from '@/components/addfood/buscarAlimento/Buscador';
import Barra from '@/components/addfood/buscarAlimento/Barra';
import AlimentoMiniCard from '@/components/addfood/buscarAlimento/AlimentoMiniCard';
import { miniCartaAlimento } from '../../../../../backend/src/dto/alimentos.dto';

export default function BuscarAlimento() 
{
  // mostrar alimentos con predominancia de un macronutriente
  const [quienPulsado, setquienPulsado] = useState<number>(0); 

  const [alimentosLista, setalimentosLista] = useState<miniCartaAlimento[]>([]);

  const [comidabuscada, setcomidabuscada] = useState<string>(""); // si se busca una comida...



  // si el usuario busca comida, entonces la barra tiene q cambiar para solo
  // mostrar alimentos q hagan match
  useEffect(() => 
  {
    if(comidabuscada!= "")
      setquienPulsado(3)

    if(comidabuscada.length >= 1)
      dameListaAlimentos()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comidabuscada]);


  const dameListaAlimentos = async () =>
  {
    try
    {
      const response = await axios.get(
        `${API_URL}/alimentos/search/${comidabuscada}`,
        {
          headers: {
              'Content-Type': 'application/json'
          },
        }
      );
      if(response.data.foods != null)
      {
        const recoge = [];
        for(let i=0; i< response.data.foods.length; i++)
        {
          let objeto: miniCartaAlimento = 
          {
            nombre: response.data.foods[i].nombre,
            predomina:response.data.foods[i].predomina,
            calorias_100gr: response.data.foods[i].calorias_100gr
          }
          recoge.push(objeto)
        }
        setalimentosLista(recoge)
      }
      else if(response.data.foods.length == 0)
      {
        
      }
    }
    catch (error) {
    console.error('Error fetching data:', error);
    }
  }  


  useEffect(() => 
  {
    const getMacroNutrientsFoods = async () =>
    {
      try
      {
        const response = await axios.get(
          `${API_URL}/alimentos/macroPredomina/${quienPulsado}`,
          {
            headers: {
                'Content-Type': 'application/json'
            },
          }
        );
        if(response.data.foods != null)
        {
          const recoge = [];
          for(let i=0; i< response.data.foods.length; i++)
          {
            let objeto: miniCartaAlimento = 
            {
              nombre: response.data.foods[i].nombre,
              predomina:response.data.foods[i].predomina,
              calorias_100gr: response.data.foods[i].calorias_100gr
            }
            recoge.push(objeto)
          }
          setalimentosLista(recoge)
        }
      }
      catch (error) {
      console.error('Error fetching data:', error);
      }
    }  
   
    getMacroNutrientsFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quienPulsado]);


  return (
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
        {/* title */}
        <CustomCard hijo={
            <>
                <Buscador setcomidabuscada={setcomidabuscada} comidabuscada={comidabuscada}></Buscador>

                 <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px" mt="20px">
                  <Button
                    fontSize="sm"
                    borderRadius="16px"
                    bg="purple.100"
                    w={{sd:"70%", md: "70%"}}
                    mt="20px"
                    h="90%"
                    // onClick={()=> location.href = "./crearAlimento"}
                    p="10px"
                    _hover={{bg:"gray.100"}}
                    leftIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-360h280l80-80H240v80Zm0-160h240v-80H240v80Zm-80-160v400h280l-80 80H80v-560h800v120h-80v-40H160Zm756 212q5 5 5 11t-5 11l-36 36-70-70 36-36q5-5 11-5t11 5l48 48ZM520-120v-70l266-266 70 70-266 266h-70ZM160-680v400-400Z"/></svg>}
                    > MY CREATED FOODS
                    </Button>

                    <Button
                    fontSize="sm"
                    borderRadius="16px"
                    bg="purple.100"
                    w={{sd:"70%", md: "70%"}}
                    mt="20px"
                    h="90%"
                    onClick={()=> location.href = "./crearAlimento"}
                    p="10px"
                    _hover={{bg:"gray.100"}}
                    leftIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z"/></svg>}
                    > CREATE A FOOD
                    </Button>

                  </SimpleGrid>

                  <Barra setquienPulsado={setquienPulsado} quienPulsado={quienPulsado}></Barra>


                {/* hacer un div y ponerlos con un .map */}
                {alimentosLista.length > 0 && alimentosLista.map((alimento, index) => (
                  <AlimentoMiniCard 
                    key={index}
                    nameAlimento={alimento.nombre} 
                    predomina={alimento.predomina} 
                    calorias={alimento.calorias_100gr} 
                  />
                ))} 

                <Box  justifyContent="center">
                {alimentosLista.length ==0 && comidabuscada== "" && <PurpleSpinner></PurpleSpinner>}
                </Box>

                <Box  justifyContent="center">
                {alimentosLista.length == 0 && comidabuscada!= "" && <Text mt="20px">Food not found</Text>}
                </Box>
                 

            </>}></CustomCard>
    </Flex>);

}
