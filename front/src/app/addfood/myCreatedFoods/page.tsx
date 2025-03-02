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
import PopUpMessage from '@/components/global/message/PopUpMessage';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';
import PurpleSpinner from '@/components/global/random/Spinner';
import CustomCard from '@/components/global/cards/CustomCard';
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

export default function myCreatedFoods() 
{
  const [cargado, setcargado] = useState<boolean>(false); 
    const userNom = useRef<string>("");

  // mostrar alimentos con predominancia de un macronutriente
  const [quienPulsado, setquienPulsado] = useState<number>(0); 

  const [alimentosLista, setalimentosLista] = useState<miniCartaAlimento[]>([]);

  const [comidabuscada, setcomidabuscada] = useState<string>(""); // si se busca una comida...



  // si el usuario busca comida, entonces la barra tiene q cambiar para solo
  // mostrar alimentos q hagan match
  useEffect(() => 
  {
    let nom = sessionStorage.getItem("userNom")
    if(nom)
        userNom.current = nom;

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
            id: response.data.foods[i].id,
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
    getMacroNutrientsFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quienPulsado]);


  const getMacroNutrientsFoods = async () =>
  {
    console.log("jwodq")
    if(userNom.current)
    {
        try
        {
            const response = await axios.get(
            `${API_URL}/alimentos/userFoodMacro/${quienPulsado}/${userNom.current}`,
                {
                headers: {
                    'Content-Type': 'application/json'
                },});

                console.log(response.data)
            if(response.data.foods != null)
            {
                const recoge = [];
                for(let i=0; i< response.data.foods.length; i++)
                {
                let objeto: miniCartaAlimento = 
                {
                    id:response.data.foods[i].id,
                    nombre: response.data.foods[i].nombre,
                    predomina:response.data.foods[i].predomina,
                    calorias_100gr: response.data.foods[i].calorias_100gr
                }
                recoge.push(objeto)
                }
                setalimentosLista(recoge)
                setcargado(true)
            }
        }
        catch (error) {
        console.error('Error fetching data:', error);
        }
    }
  };


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
        {cargado ==true && <CustomCard hijo={
        <>

          <Text
            color="purple.300"
            fontWeight="500"
            fontSize="md"
            textAlign="left"
            alignSelf="flex-start"
            cursor="pointer"
            justifySelf="flex-start"
            as="a"
            href="../../myday"
          >
              ←
          </Text>

          <Buscador setcomidabuscada={setcomidabuscada} comidabuscada={comidabuscada}></Buscador>

          <Barra setquienPulsado={setquienPulsado} quienPulsado={quienPulsado}></Barra>

          {/* hacer un div y ponerlos con un .map */}
          {alimentosLista.length > 0 && alimentosLista.map((alimento, index) => (
            <AlimentoMiniCard 
              key={index}
              userNom={userNom.current}
              idAlimento = {alimento.id} 
              nameAlimento={alimento.nombre} 
              predomina={alimento.predomina} 
              calorias={alimento.calorias_100gr}
              getMacroNutrientsFoods={getMacroNutrientsFoods} 
            />
          ))} 

          

          <Box  justifyContent="center">
          {alimentosLista.length == 0 && comidabuscada!= "" && <Text mt="20px">Food not found</Text>}
          </Box>
              
        </>}></CustomCard>} 

        {cargado == false && <Box  justifyContent="center">
          {alimentosLista.length ==0 && comidabuscada== "" && <PurpleSpinner></PurpleSpinner>}
        </Box>}

    </Flex>);

}
