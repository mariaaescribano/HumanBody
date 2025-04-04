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
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import CustomCard from '@/components/global/cards/CustomCard';
import { API_URL, colorNutricionist, getInternetDateParts, redirigirSiNoHayNutriNom, redirigirSiNoHayUserNom, tryAgain } from '../../../GlobalHelper';
import { CircProgressMini } from '@/components/myday/CircProgressMini';
import MacroCalView from '@/components/myday/MacroCalView';
import ElementoPrimero from '@/components/myday/ElementoPrimero';
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import Buscador from '@/components/addfood/buscarAlimento/Buscador';
import Barra from '@/components/addfood/buscarAlimento/Barra';
import AlimentoMiniCard from '@/components/addfood/AlimentosCard/AlimentoMiniCard';
import { miniCartaAlimento } from '../../../../../backend/src/dto/alimentos.dto';
import BarraMenu from '@/components/global/BarraMenu';
import { useRouter } from 'next/navigation';
import BarraMenuNutri from '../../nutritionist/BarraMenuNutri';
import GreenSpinner from '../../global/random/GreenSpinner';
import AceptarFoodRecomendadaPorNutri from './AceptarFoodRecomendadaPorNutri';

// COMO FALLA?
// falla llamada al back --> devolver mensaje de intentalo más tarde

// ESTRATEGIA: si es nutri 
// NO buscar favs de usuarios, solo devolver alimentos
// cambiar AlimentosMiniCard

export default function ShowBuscarFoodPage(props: { 
  verMisCreaciones: boolean; 
  cargado: boolean; 
  setcargado: any;
}) {
  const { cargado, setcargado } = props;

  const [alimentosLista, setalimentosLista] = useState<miniCartaAlimento[]>([]);
  const [nutri, setnutri ] = useState<boolean>();
  const [listaLoaded, setlistaLoaded] = useState<boolean>(false); // mostrar lista de alimentos
  const userName = useRef<string>("");

  // mostrar mensaje si ha habido algun error
  const [mensajeError, setmensajeError] = useState<boolean>(false); 

  // mostrar alimentos con predominancia de un macronutriente
  const [quienPulsado, setquienPulsado] = useState<number>(0); 

  const [comidabuscada, setcomidabuscada] = useState<string>(""); // si se busca una comida...


  useEffect(() => 
  {
    const queryParams = new URLSearchParams(location.search);
    const soyNutri = queryParams.get('soyNutri');
    if(soyNutri)
    {
      setnutri(true)
      redirigirSiNoHayNutriNom();
      let nom = sessionStorage.getItem("nutriNom")
      if(nom)
        userName.current = nom; 
    }
    else
    {
      setnutri(false)
      redirigirSiNoHayUserNom();
      let nom = sessionStorage.getItem("userNom")
      if(nom)
        userName.current = nom; 
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // si el usuario busca comida, entonces la barra tiene q cambiar para solo
  // mostrar alimentos q hagan match
  useEffect(() => 
  {
    if(comidabuscada!= "")
      setquienPulsado(4)

    if(comidabuscada.length >= 1)
      dameListaAlimentos()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comidabuscada]);


  const dameListaAlimentos = async () =>
  {
    try
    {
      const response = await axios.get(
        `${API_URL}/alimentos/search/${comidabuscada}/${userName.current}/${props.verMisCreaciones}`,
        {
            headers: {
              'Content-Type': 'application/json'
            },
        }
      );
      if(response.data)
      {
        let foods = response.data;
        if(response.data.foods)
          foods = response.data.foods;
        
        const recoge = [];
        for(let i=0; i< foods.length; i++)
        {
          let objeto: miniCartaAlimento = 
          {
            id:foods[i].id,
            nombre: foods[i].nombre,
            predomina:foods[i].predomina,
            calorias_100gr: foods[i].calorias_100gr,
            es_fav_deUsu: foods[i].es_fav_deUsu
          }
          recoge.push(objeto)
        }
        setalimentosLista(recoge)
      }
      else if(!response.data.foods || response.data.foods == undefined || response.data.foods.length == 0 )
      {
        setalimentosLista([])
      }
    }
    catch (error:any) 
    {
      if(error.status== 400)
        console.log("Solicitud al back mal formada. Lo que se envió:", comidabuscada)
      else
      {
        setalimentosLista([])
        console.log(error)
        setmensajeError(true)
      }
    }
  }  


  useEffect(() => 
  {
    if(quienPulsado!= 4 && nutri != undefined)
    {
      if(nutri == false)
        getMacroNutrientsFavsFoods();
      else
        getMacroNutrientsFoods();
    }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quienPulsado, nutri]);

  // can: return the fav foods of the user // return the created foods of an user
  const getMacroNutrientsFavsFoods = async () =>
  {
    if(userName.current!= undefined)
    {
      setlistaLoaded(false)
      setalimentosLista([])
      try
      {
        let url="";
        if(props.verMisCreaciones == true)
            url =  `${API_URL}/alimentos/userFoodMacro/${quienPulsado}/${userName.current}`
        else
            url =  `${API_URL}/alimentos/macroPredomina/${quienPulsado}/${userName.current}`

        const response = await axios.get(
          `${url}`,
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
              id:response.data.foods[i].id,
              nombre: response.data.foods[i].nombre,
              predomina:response.data.foods[i].predomina,
              calorias_100gr: response.data.foods[i].calorias_100gr,
              es_fav_deUsu: response.data.foods[i].es_fav_deUsu
            }
            recoge.push(objeto)
          }
          setalimentosLista(recoge)
          if(!cargado)
            setcargado(true)
        }
      }
      catch (error:any) 
      {
        if(error.status== 400)
          console.log("Solicitud al back mal formada. Lo que se envió:", quienPulsado, userName.current)
        else
        {
          setmensajeError(true)
        }
      }
    }
  };

  const getMacroNutrientsFoods = async () =>
  {
    if(userName.current!= undefined)
    {
      setlistaLoaded(false)
      setalimentosLista([])
      try
      {
        let url="";
        if(props.verMisCreaciones == true)
          url =  `${API_URL}/alimentos/userFoodMacro/${quienPulsado}/${userName.current}`
        else
          url =  `${API_URL}/alimentos/macroPredomina/${quienPulsado}`

        const response = await axios.get(
          `${url}`,
          {
            headers: {
                'Content-Type': 'application/json'
            },
          }
        );
        if(response.data != null)
        {
          const recoge = [];
          for(let i=0; i< response.data.length; i++)
          {
            let objeto: miniCartaAlimento = 
            {
              id:response.data[i].id,
              nombre: response.data[i].nombre,
              predomina:response.data[i].predomina,
              calorias_100gr: response.data[i].calorias_100gr,
              es_fav_deUsu: response.data[i].es_fav_deUsu
            }
            recoge.push(objeto)
          }
          setalimentosLista(recoge)
          if(!cargado)
            setcargado(true)
        }
        else
          setalimentosLista([])
      }
      catch (error:any) 
      {
        if(error.status== 400)
          console.log("Solicitud al back mal formada. Lo que se envió:", quienPulsado, userName.current)
        else
        {
          setmensajeError(true)
        }
      }
    }
  };

  useEffect(() => 
  {
    const timer = setTimeout(() => 
    {
      setlistaLoaded(true)
    }, 500);
    return () => clearTimeout(timer); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alimentosLista]);

  const gotocreatedfoods = () =>
  {
    if(nutri==true)
      location.href =  "./myCreatedFoods?soyNutri=true"
    else
      location.href =  "./myCreatedFoods"
  };


  return (
    <Flex
        direction="column"
        align="center"
        bg={nutri == undefined ? "white" : nutri == true ? colorNutricionist : "purple.100"}
        w="100%"
        h="100%"
        justify="center"
        p="20px"
        minH="100vh"
        position={"relative"}
    >
        {nutri==false && <BarraMenu></BarraMenu>}
        {nutri==true && <BarraMenuNutri></BarraMenuNutri>}

        {/* title */}
        {props.verMisCreaciones == true && cargado ==true &&
        <CustomCard mt="0px" hijo={
            <Text color={"black"} fontSize="2xl" h="10px" fontWeight="bold" mt="-25px">
                MY CREATED FOODS
            </Text>
        }></CustomCard>}

        {cargado ==true && nutri!=undefined &&
        <CustomCard mt={props.verMisCreaciones == true ? "10px" : "0px"} hijo={
        <>
        <Buscador setcomidabuscada={setcomidabuscada} comidabuscada={comidabuscada}></Buscador>

        {props.verMisCreaciones == false && <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: "20px", md: "50px" }} mt="20px">
            <Button
            fontSize="sm"
            borderRadius="16px"
            bg={nutri == true ? colorNutricionist : "purple.100"}
            w={{sd:"70%", md: "70%"}}
            mt="20px"
            h="90%"
            onClick = {gotocreatedfoods}
            p="10px"
            _hover={{bg:"gray.100"}}
            leftIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-360h280l80-80H240v80Zm0-160h240v-80H240v80Zm-80-160v400h280l-80 80H80v-560h800v120h-80v-40H160Zm756 212q5 5 5 11t-5 11l-36 36-70-70 36-36q5-5 11-5t11 5l48 48ZM520-120v-70l266-266 70 70-266 266h-70ZM160-680v400-400Z"/></svg>}
            > MY CREATED FOODS
            </Button>

            <Button
            fontSize="sm"
            borderRadius="16px"
            bg={nutri == true ? colorNutricionist : "purple.100"}
            w={{sd:"70%", md: "70%"}}
            mt="20px"
            h="90%"
            as="a"
            href= "./crearAlimento"
            p="10px"
            _hover={{bg:"gray.100"}}
            leftIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z"/></svg>}
            > CREATE A FOOD
            </Button>

        </SimpleGrid>} 



        {/* food recomendada por nutri */}
        {nutri==false && <AceptarFoodRecomendadaPorNutri></AceptarFoodRecomendadaPorNutri> }


        <Barra setquienPulsado={setquienPulsado} quienPulsado={quienPulsado} setcomidabuscada={setcomidabuscada}></Barra>
        {/* pone los alimentos fav primero */}
        {alimentosLista.length > 0 && listaLoaded &&
            alimentosLista 
            .sort((a, b) => Number(b.es_fav_deUsu) - Number(a.es_fav_deUsu)) // Los favoritos van primero
            .map((alimento, index) => (
                <AlimentoMiniCard 
                key={alimento.id}
                nutri={nutri}
                editando={props.verMisCreaciones}
                idAlimento={alimento.id} 
                nameAlimento={alimento.nombre} 
                predomina={alimento.predomina} 
                userNom={userName.current} 
                calorias={alimento.calorias_100gr}
                favDeUser={alimento.es_fav_deUsu}  
                getMacroNutrientsFoods={getMacroNutrientsFavsFoods}
                />
            ))
        }

        {!listaLoaded &&
        <Spinner
        thickness="4px"
        mt="50px"
        speed="0.65s"
        emptyColor="gray.200"
        color={nutri == true ? colorNutricionist : "purple.100"}
        size="xl"
        /> }

        <Box justifyContent="center">
        {alimentosLista.length == 0 && comidabuscada!= "" && <Text mt="20px" color="red.300">Food not found</Text>}
        </Box>

        {mensajeError == true && <PopUpErrorMessage title={'Error'} texto={tryAgain}></PopUpErrorMessage>}
            
        </>}></CustomCard>} 



        {cargado == false && <Box justifyContent="center">
       
        {alimentosLista.length ==0 && comidabuscada== "" && nutri==true && <GreenSpinner></GreenSpinner>}
      
      </Box>}
    </Flex>);
}
