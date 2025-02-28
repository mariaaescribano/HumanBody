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
import { API_URL, crearRecibo, dameDatosDelRecibo, getFecha, getInternetDateParts, getTamanyoPantalla } from '../../../GlobalHelper';
import { CircProgressMini } from '@/components/myday/CircProgressMini';
import MacroCalView from '@/components/myday/MacroCalView';
import ElementoPrimero from '@/components/myday/ElementoPrimero';
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import { macroPorcentajes, reciboSkeleton, showMacroNutrSignUp } from '../../../../backend/src/dto/recibos.dto';
import { showEbook } from '../../../../backend/src/dto/ebook.dto';
import FiberCard from '@/components/global/cards/FiberCard';
import { PieChardMacroNutr } from '@/components/global/cards/PieChardMacroNutr';
import InputField from '@/components/global/random/InputField';
import EBookButton from '@/components/global/random/EBookButton';

export default function mealDiary() 
{
  // lo necesario para 1 dia en sessionstorage
  const idReciboDeHoy = useRef<number>(-1);
  const idReciboObjetivo = useRef<number>(-1);

  const [screenSize, setscreenSize ] = useState<string>("");

  // lo q el usuario ha consumido en 1 dia se guarda aqui
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





  // 0: encuentra datos en el ss
  useEffect(() => 
  {
    let userNom = sessionStorage.getItem("userNom");
    if(userNom)
      getDiaAnterior(userNom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1:  funcion q vea q dia es hoy y q te devuelva el dia de ayer
  const getDiaAnterior = async (userNom:string) =>
  {
    console.log("efewwwwwwwwwwwwwwwfw")
    let dia = await getFecha();
    let idDia = await getUserYesterday(userNom, dia);

  };


  const getUserYesterday = async (userNom:string, dia:string) =>
  {
    console.log("efewfw")
    try{
      const response = await axios.get(
        `${API_URL}/dias/diaAnterior/${userNom}/${dia}`,
        {
          headers: {
              'Content-Type': 'application/json'
          },
        }
      );
      console.log(response.data)
      if(response.data)
        return response.data;
      }
      catch (error) {
      console.error('Error fetching data:', error);
      }
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

  // cada vez q el recibo cambia se actualiza el porcentaje
  useEffect(() => 
  {
    if(reciboObjetivo!= null)
    {
      let protePorcentaje = calcularPorcentaje(parseInt(reciboDeHoy.prote, 10), parseInt(reciboObjetivo.prote, 10))
      let fatPorcentaje = calcularPorcentaje(parseInt(reciboDeHoy.grasas, 10), parseInt(reciboObjetivo.grasas, 10))
      let carbsPorcentaje = calcularPorcentaje(parseInt(reciboDeHoy.carbs, 10), parseInt(reciboObjetivo.carbs, 10))
      let fibraPorcentaje = calcularPorcentaje(parseInt(reciboDeHoy.fibra, 10), parseInt(reciboObjetivo.fibra, 10))
      // console.log(reciboDeHoy.prote, parseInt(reciboDeHoy.prote, 10), parseInt(reciboObjetivo.prote, 10))
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




// #region EBOOKS 
   const proteinEbooks: showEbook[] = [
      {
          title: "What are amino acids?",
          onclick: undefined
      },
      {
          title: "How proteins repair my cells?",
          onclick: undefined
      }
      ];
  
      let proteinButtons: showMacroNutrSignUp[] = [];
  
      if (reciboDeHoy != null) 
      {
          proteinButtons = [
              { 
              label: "Complete proteins", 
              price: `${reciboDeHoy.completo == "" ? 0 : reciboDeHoy.completo} grams`, 
              tooltip: "Contain all essential amino acids your body needs for regeneration." 
              },
              { 
              label: "Incomplete proteins", 
              price: `${reciboDeHoy.incompleto} grams`, 
              tooltip: "Lack one or more essential amino acids needed for regeneration." 
              }
          ];
      }
  
      const fatEbooks: showEbook[] = [
          {
            title: "How monounsaturated fats help me?",
            onclick: undefined
          },
          {
            title: "How polyunsaturated fats help me?",
            onclick: undefined
          },
          {
            title: "Why saturated fats can hurt me?",
            onclick: undefined
          }
      ];
      
      let fatButtons: showMacroNutrSignUp[] = [];
      
      if (reciboDeHoy != null) {
          fatButtons = [
              {
              label: "Monounsaturated",
              price: `${reciboDeHoy.monoinsaturadas} grams`,
              tooltip: "Heart-friendly fats that support cholesterol balance and overall health."
              },
              {
              label: "Polyunsaturated",
              price: `${reciboDeHoy.poliinsaturadas} grams`,
              tooltip: "Essential fats, including omega-3 and omega-6, crucial for brain and cell function."
              },
              {
              label: "Saturated",
              price: `${reciboDeHoy.saturadas} grams`,
              tooltip: "Stable fats that provide energy but should be consumed in moderation."
              }
          ];
      }
        
      const carbEbooks: showEbook[] = [
      {
          title: "Why I need complex carbs?",
          onclick: undefined
      },
      {
          title: "Do I need simple carbs?",
          onclick: undefined
      }
      ];
  
      const fiberEbooks: showEbook[] = [
      {
          title: "Fiber and microbiota",
          onclick: undefined
      },
      {
          title: "Fiber and neurogenesis",
          onclick: undefined
      },
      {
          title: "Fiber and neurotransmissors",
          onclick: undefined
      }
      ];
      
      let carbButtons: showMacroNutrSignUp[] = [];
      
      if (reciboDeHoy != null) {
      carbButtons = [
          // {
          // label: "Fiber",
          // price: `${recibo.fibra} grams`,
          // tooltip: "Fiber promotes healthy digestion, supports heart health, helps regulate blood sugar levels and supports neuron and brain activity."
          // },
          {
          label: "Complex",
          price: `${ Math.round(parseInt(reciboDeHoy.complejos, 10)) } grams`,
          tooltip: "Provide long-lasting energy and fiber, digesting slowly."
          },
          {
          label: "Simples",
          price: `${reciboDeHoy.simples} grams`,
          tooltip: "Digest quickly, giving a fast but short energy boost."
          }
      ];
      }


// #endregion EBOOKS 



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
        <CustomCard hijo={
          <>
            <Box mb={{ base: "20px", md: "50px" }} alignItems={"center"} justifyContent={"center"}>
              <Flex
                  justify="center"  // Centra los elementos horizontalmente
                  align="center"    // Centra los elementos verticalmente
              >
                  <SimpleGrid
                      w={{ base: "100%", md: "70%" }}  
                      columns={{ base: 1, md: 2 }}  // En pantallas pequeñas, 1 columna; en pantallas medianas, 2 columnas
                      spacing={{ base: "30px", md: "50px" }}  // Espacio entre los elementos
                  >
                      <Box w={{ sd: "auto", md: "200px" }} mt={{ base: "0px", md: "25px", xl: "25px" }}>
                          <PieChardMacroNutr pieChartData={pieChardData} />
                      </Box>
                      <MacroCalView macroPorcentaje={props.macroPorcentaje}/>
                  </SimpleGrid>
              </Flex>
            </Box>
          
            <InputField
              mb="20px"
              // onChange= {(e:any) => foodName.current = e.target.value}
              id="first"
              disa
              placeholder="Apple"
              label="Food Name"
              />
    
            <Box w="100%" borderBottom="2px solid black" my="20px" />
            <EBookButton texto={'What happens if...?'}></EBookButton>
          </>
        }></CustomCard>

       {/* <CustomCard hijo={ 
        <>
        <Text mb="20px" textAlign="left" alignSelf="flex-start"
            justifySelf="flex-start">Learn about the past ...</Text>
        <Button
               fontSize="sm"
               borderRadius="16px"
               bg="purple.100"
               w="100%"
               h="auto"
               p="10px"
               as="a"
               href="../mealDiary"
               _hover={{bg:"gray.100"}}
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-80q-50 0-85-35t-35-85v-560q0-50 35-85t85-35h440v640H240q-17 0-28.5 11.5T200-200q0 17 11.5 28.5T240-160h520v-640h80v720H240Zm120-240h240v-480H360v480Zm-80 0v-480h-40q-17 0-28.5 11.5T200-760v447q10-3 19.5-5t20.5-2h40Zm-80-480v487-487Z"/></svg>}// onClick={comprobarSiPoderPaso2}
               > DIARY OF MEALS
               </Button>
               </>}>
        </CustomCard>


        { reciboObjetivo!= null && <>
        <CustomCard hijo={ 
            <>
            <Text color={"black"} fontSize="xl" w="100%"  fontWeight="700" textAlign="center">
                TODAY'S MACRONUTRIENTS
            </Text>
            </>
        }>
        </CustomCard>

        <CustomCard hijo={ 
            <MacroNutrCard title={'PROTEINS'} total={reciboDeHoy.prote}  screenSize={screenSize}  infoLista={proteinButtons} ebooklista={proteinEbooks}></MacroNutrCard>} >
        </CustomCard>

        <CustomCard 
        hijo={ 
            <MacroNutrCard 
            title={'FATS'} 
            total={reciboDeHoy.grasas} 
            infoLista={fatButtons} 
            screenSize={screenSize} 
            ebooklista={fatEbooks} 
            />
        } 
        />
    
        <CustomCard
        hijo={ 
            <MacroNutrCard 
            title={'CARBS'} 
            total={reciboDeHoy.carbs} 
            infoLista={carbButtons} 
            screenSize={screenSize} 
            ebooklista={carbEbooks} 
            />
        } 
        />    

        {screenSize != "" && <CustomCard mb="50px" hijo={ 
              <FiberCard edit={false} totalFiber={reciboDeHoy.fibra} screenSize={screenSize}></FiberCard>}></CustomCard>}


      </>} 

       </Flex>}  */}


      {macroPorcentaje == null && <PurpleSpinner></PurpleSpinner>} 
      </Flex>} 
      </>
    );

}
