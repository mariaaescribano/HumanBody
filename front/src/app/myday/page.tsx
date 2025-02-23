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
import { API_URL, crearRecibo, dameDatosDelRecibo, getInternetDateParts } from '../../../GlobalHelper';
import { CircProgressMini } from '@/components/myday/CircProgressMini';
import MacroCalView from '@/components/myday/MacroCalView';
import ElementoPrimero from '@/components/myday/ElementoPrimero';
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import { macroPorcentajes, reciboSkeleton } from '../../../../backend/src/dto/recibos.dto';

export default function MyDay() 
{
  // lo necesario para 1 dia en sessionstorage
  const idReciboDeHoy = useRef<number>(-1);
  const idReciboObjetivo = useRef<number>(-1);

  // lo q el usuario consume en 1 dia se guarda aqui
  const [reciboDeHoy, setreciboDeHoy ] = useState< reciboSkeleton >(
    {
      grasas:"0",
      monoinsaturadas:"0",
      poliinsaturadas:"0",
      saturadas:"0",
      prote:"0",
      incompleto:"0",
      completo:"0",
      carbs:"0",
      complejos:"0",
      simples:"0",
      fibra:"0"
    }
  );

  const [reciboObjetivo, setreciboObjetivo ] = useState< reciboSkeleton | null >(null);

  // y el porcentaje aqui
  const [macroPorcentaje, setmacroPorcentajes ] = useState< macroPorcentajes | null >(null);

  ///////////////////// END DECLARATIONS /////////////////////





  // 0: mira si ya hay recibo y calorias para el dia de hoy, si no lo hay lo crea
  useEffect(() => 
  {
    let id = sessionStorage.getItem("reciboDeHoy");
    let idReciboObjetivoo = sessionStorage.getItem("reciboObjetivo");

    // no hay nada en la BD, lo creo de zero
    if(id == null )
    {
      creaRecibo();
    }
    // ya hay datos en la BD, los recoge
    else if(id &&idReciboObjetivoo)
    {
      recuperaDatosSiSSNoVacia(id,  idReciboObjetivoo)
    }
     
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // recupera id de reciboDeHoy y de Objetivo 
  const recuperaDatosSiSSNoVacia = async (id:string, idReciboObjetivoo: string) =>
  {
    idReciboDeHoy.current = parseInt(id, 10);
    await dameDatosDelRecibo(idReciboDeHoy.current, setreciboDeHoy);
    await dameDatosDelRecibo(parseInt(idReciboObjetivoo, 10), setreciboObjetivo);
    idReciboObjetivo.current = parseInt(idReciboObjetivoo, 10);
  };


  const creaRecibo = async () =>
  {
    idReciboDeHoy.current = await crearRecibo(reciboDeHoy);
    await crearDia(idReciboDeHoy.current);

    let nombreuser = sessionStorage.getItem("userNom");
    if(nombreuser)
    {
      let datos = await dameUsuarioReciboObjetivo(nombreuser);
    
      sessionStorage.setItem("reciboObjetivo", datos.recibo_id)
      sessionStorage.setItem("caloriasObjetivo", datos.calorias_objetivo)
      sessionStorage.setItem("caloriasDeHoy", "0")

      dameDatosDelRecibo(datos.recibo_id, setreciboObjetivo);
      idReciboObjetivo.current = datos.recibo_id;
    }

    sessionStorage.setItem("reciboDeHoy", idReciboDeHoy.current.toString())
  };


  const dameUsuarioReciboObjetivo = async (nombre:string) =>
  {
    try{
      const response = await axios.get(
        `${API_URL}/usuarios/usuCaloriasReciboObjetivo/${nombre}`,
        {
          headers: {
              'Content-Type': 'application/json'
          },
        }
      );
      if(response.data)
        return response.data;
      }
      catch (error) {
      console.error('Error fetching data:', error);
      }
  };

  const crearDia = async (reciboDeHoy:number) =>
    {
      try{
        const response = await axios.post(
          `${API_URL}/dias/createDia`,
          { reciboDeHoy },
          {
            headers: {
                'Content-Type': 'application/json'
            },
          }
        );
        if(response.data)
          sessionStorage.setItem("diaId", response.data)
        }
        catch (error) {
        console.error('Error fetching data:', error);
        }
  };

  

  // cada vez q el recibo cambia se actualiza el porcentaje
  useEffect(() => 
  {
    if(reciboObjetivo!= null)
    {
      let protePorcentaje = calcularPorcentaje(parseInt(reciboDeHoy.prote, 10), parseInt(reciboObjetivo.prote, 10))
      let fatPorcentaje = calcularPorcentaje(parseInt(reciboDeHoy.grasas, 10), parseInt(reciboObjetivo.grasas, 10))
      let carbsPorcentaje = calcularPorcentaje(parseInt(reciboDeHoy.carbs, 10), parseInt(reciboObjetivo.carbs, 10))
      let fibraPorcentaje = calcularPorcentaje(parseInt(reciboDeHoy.fibra, 10), parseInt(reciboObjetivo.fibra, 10))
      console.log(reciboDeHoy.prote, parseInt(reciboDeHoy.prote, 10), parseInt(reciboObjetivo.prote, 10))
      setmacroPorcentajes({
        prote:protePorcentaje,
        grasas:fatPorcentaje,
        carbs:carbsPorcentaje,
        fibra:fibraPorcentaje
      });
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reciboDeHoy, reciboObjetivo]);

  const calcularPorcentaje = (parte:number, total:number) => {
    return total > 0 ? (parte / total) * 100 : 0;
  };



  return (
    <>
    
    {macroPorcentaje!= null && 
      <Flex
        direction="column"
        align="center"
        bg="purple.100"
        w="100%"
        h="100%"
        justify="center"
        p="30px"
        minH="100vh"
        position={"relative"}
    >
        {/* title */}
        <Card
            width={{ base: "90%", md: "100%" }}
            height="auto"
            maxWidth="800px"
            p="10px"
            align="center"
            justify="center"
            borderRadius={"20px"}
            >
            <HStack justify="space-between" width="100%" align="center">
                {/* Botón con flecha hacia la izquierda */}
                <IconButton
                icon={<ArrowLeftIcon />}
                aria-label="Go Left"
                onClick={() => alert("Going Left")}
                variant="ghost"
                />

                {/* Contenido Central */}
                <VStack alignItems={"center"}>
                <Text color={"black"} fontSize="2xl" fontWeight="700">
                    MY DAY
                </Text>
                <HStack spacing="5px" alignItems="center">
      {/* Ícono SVG */}

        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000">
          <path d="M202.87-71.87q-37.78 0-64.39-26.61t-26.61-64.39v-554.26q0-37.78 26.61-64.39t64.39-26.61H240v-80h85.5v80h309v-80H720v80h37.13q37.78 0 64.39 26.61t26.61 64.39v554.26q0 37.78-26.61 64.39t-64.39 26.61H202.87Zm0-91h554.26V-560H202.87v397.13Zm0-477.13h554.26v-77.13H202.87V-640Zm0 0v-77.13V-640Z"/>
        </svg>


      {/* Texto */}
      <Text color={"black"} fontSize="md" fontWeight="700">
        12/09/2033
      </Text>
    </HStack>
                </VStack>

                {/* Flecha hacia la derecha */}
                <IconButton
                icon={<ArrowRightIcon />}
                aria-label="Go Right"
                variant="ghost"
                />
            </HStack>
        </Card>

       {/* calorias y macronutrients overall view */}
        <CustomCard hijo={<ElementoPrimero macroPorcentaje={macroPorcentaje}></ElementoPrimero>}></CustomCard>

       <CustomCard hijo={ <Button
               fontSize="sm"
               borderRadius="16px"
               bg="purple.100"
               w="100%"
               h="auto"
               p="10px"
               _hover={{bg:"gray.100"}}
                leftIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-80q-50 0-85-35t-35-85v-560q0-50 35-85t85-35h440v640H240q-17 0-28.5 11.5T200-200q0 17 11.5 28.5T240-160h520v-640h80v720H240Zm120-240h240v-480H360v480Zm-80 0v-480h-40q-17 0-28.5 11.5T200-760v447q10-3 19.5-5t20.5-2h40Zm-80-480v487-487Z"/></svg>}// onClick={comprobarSiPoderPaso2}
               > DIARY OF MEALS
               </Button>}>
        </CustomCard>


        <CustomCard bgColor="#efe5e5" hijo={ 
            <>
            <Text color={"black"} fontSize="xl" w="100%" fontWeight="700" textAlign="left">
                TODAY'S MACRONUTRIENTS
            </Text>
            </>
        }>
        </CustomCard>


                   {/* <CustomCard hijo={ 
                       <MacroNutrCard title={'PROTEINS'} totalMacro={recibo.prote} total={'TOTAL PROTEINS'} infoLista={proteinButtons} screenSize={screenSize} ebooklista={proteinEbooks}></MacroNutrCard>} >
                   </CustomCard>
       
       
    
                       <CustomCard 
                       hijo={ 
                           <MacroNutrCard 
                           title={'FATS'} 
                           totalMacro={recibo.grasas}
                           total={'TOTAL FATS'} 
                           infoLista={fatButtons} 
                           screenSize={screenSize} 
                           ebooklista={fatEbooks} 
                           />
                       } 
                       />
                   
       

                       <CustomCard mb="50px"
                       hijo={ 
                           <MacroNutrCard 
                           title={'CARBS'} 
                           totalMacro={recibo.carbs}
                           total={'TOTAL CARBS'} 
                           infoLista={carbButtons} 
                           screenSize={screenSize} 
                           ebooklista={carbEbooks} 
                           />
                       } 
                       />
                */}
       
       </Flex>} 


      {macroPorcentaje == null && <PurpleSpinner></PurpleSpinner>} 
      </>
    );

}
