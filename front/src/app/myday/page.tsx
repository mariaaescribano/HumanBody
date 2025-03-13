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
import { API_URL, crearRecibo, dameDatosDelRecibo, formatDateToISOFriendly, getFecha, getInternetDateParts, getTamanyoPantalla, redirigirSiNoHayUserNom } from '../../GlobalHelper';
import ElementoPrimero from '@/components/myday/ElementoPrimero';
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import { macroPorcentajes, reciboSkeleton, showMacroNutrSignUp } from '../../../../backend/src/dto/recibos.dto';
import { fidelidadSkeleton } from '../../../../backend/src/dto/fidelidad.dto';
import { showEbook } from '../../../../backend/src/dto/ebook.dto';
import FiberCard from '@/components/global/cards/FiberCard';
import FidelidadCard from '@/components/fidelity/FidelidadCard';
import BarraMenu from '@/components/global/BarraMenu';
import { useRouter } from 'next/navigation';



export default function MyDay() 
{
  const router = useRouter();
  // lo necesario para 1 dia en sessionstorage
  const idReciboDeHoy = useRef<number>(-1);
  const idReciboObjetivo = useRef<number>(-1);

  const [screenSize, setscreenSize ] = useState<string>("");

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

  const [fecha, setfecha ] = useState<string>("");
  ///////////////////// END DECLARATIONS /////////////////////
  

  const manejarNavegacion = () => {
    router.push("/mealDiary");
  };




  // 0: mira si ya hay recibo y calorias para el dia de hoy, si no lo hay lo crea
  useEffect(() => 
  {
    redirigirSiNoHayUserNom();
    let id = sessionStorage.getItem("reciboDeHoy");
    let idReciboObjetivoo = sessionStorage.getItem("reciboObjetivo");
    getTamanyoPantalla(setscreenSize)
      // no hay nada en la BD, lo creo de zero
    if(id == null )
    {
      creaRecibo();
    }
    // ya hay datos en la BD, los recoge
    else if(id && idReciboObjetivoo)
    {
      recuperaDatosSiSSNoVacia(id,  idReciboObjetivoo)
    }
    else
      location.href = "../login/login";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // recupera id de reciboDeHoy y de Objetivo 
  const recuperaDatosSiSSNoVacia = async (id:string, idReciboObjetivoo: string) =>
  {
    let fechaDeDia = await getFecha();
    setfecha(fechaDeDia)

    idReciboDeHoy.current = parseInt(id, 10);
    await dameDatosDelRecibo(idReciboDeHoy.current, setreciboDeHoy);
    await dameDatosDelRecibo(parseInt(idReciboObjetivoo, 10), setreciboObjetivo);
    idReciboObjetivo.current = parseInt(idReciboObjetivoo, 10);
  };


  const creaRecibo = async () =>
  {
    let fechaDeDia = await getFecha();
    setfecha(fechaDeDia)

    idReciboDeHoy.current = await crearRecibo(reciboDeHoy);
    await crearDia(idReciboDeHoy.current);

    let nombreuser = sessionStorage.getItem("userNom");
    // console.log(nombreuser)
    if(nombreuser)
    {
      let datos = await dameUsuarioReciboObjetivo(nombreuser);
    
      sessionStorage.setItem("reciboObjetivo", datos.recibo_id)
      sessionStorage.setItem("caloriasObjetivo", datos.calorias_objetivo)
      sessionStorage.setItem("caloriasDeHoy", "0")

      dameDatosDelRecibo(datos.recibo_id, setreciboObjetivo);
      idReciboObjetivo.current = datos.recibo_id;
    }
    else
      location.href = "../login/login";

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
    let fecha = await getFecha();
    let userNom = sessionStorage.getItem("userNom");
    try{
      const response = await axios.post(
        `${API_URL}/dias/createDia`,
        { reciboDeHoy, fecha, userNom},
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
    
    {macroPorcentaje!= null && fecha &&
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

      <BarraMenu></BarraMenu>

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
            <HStack justify="center" width="100%" align="center">
                {/* Botón con flecha hacia la izquierda */}
                {/* <IconButton
                icon={<ArrowLeftIcon />}
                aria-label="Go Left"
                onClick={() => alert("Going Left")}
                variant="ghost"
                /> */}

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
                  {formatDateToISOFriendly(fecha)}
                </Text>
              </HStack>
                </VStack>

                {/* Flecha hacia la derecha */}
                {/* <IconButton
                icon={<ArrowRightIcon />}
                aria-label="Go Right"
                variant="ghost"
                /> */}
            </HStack>
        </Card>

       {/* calorias y macronutrients overall view */}
        <CustomCard mt="20px" hijo={<ElementoPrimero macroPorcentaje={macroPorcentaje}></ElementoPrimero>}></CustomCard>

       <CustomCard mt="10px" hijo={ 
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
          onClick={manejarNavegacion}
          _hover={{bg:"gray.100"}}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-80q-50 0-85-35t-35-85v-560q0-50 35-85t85-35h440v640H240q-17 0-28.5 11.5T200-200q0 17 11.5 28.5T240-160h520v-640h80v720H240Zm120-240h240v-480H360v480Zm-80 0v-480h-40q-17 0-28.5 11.5T200-760v447q10-3 19.5-5t20.5-2h40Zm-80-480v487-487Z"/></svg>}// onClick={comprobarSiPoderPaso2}
          > MY DIARY
          </Button>
        </>}>
        </CustomCard>

        {/* fidelidad card */}
        <CustomCard mt="10px" hijo={<FidelidadCard diaId={null}/>}></CustomCard>
                 

        { reciboObjetivo!= null && <>
        <CustomCard mt="10px" hijo={ 
            <>
            <Text color={"black"} fontSize="xl" w="100%"  fontWeight="700" textAlign="center">
                TODAY'S MACRONUTRIENTS
            </Text>
            </>
        }>
        </CustomCard>

        <CustomCard mt="10px" hijo={ 
            <MacroNutrCard title={'PROTEINS'} edit={true}
            reciboObjetivo={Number(reciboObjetivo.prote) - Number(reciboDeHoy.prote)} 
            total={reciboDeHoy.prote}  screenSize={screenSize} 
            infoLista={proteinButtons} ebooklista={proteinEbooks}></MacroNutrCard>} >
        </CustomCard>

        <CustomCard mt="10px"
        hijo={ 
            <MacroNutrCard 
            title={'FATS'} edit={true}
            reciboObjetivo={Number(reciboObjetivo.grasas) - Number(reciboDeHoy.grasas)}
            total={reciboDeHoy.grasas} 
            infoLista={fatButtons} 
            screenSize={screenSize} 
            ebooklista={fatEbooks} 
            />
        } 
        />
    
        <CustomCard mt="10px"
        hijo={ 
            <MacroNutrCard 
            title={'CARBS'} edit={true}
            reciboObjetivo={Number(reciboObjetivo.carbs) - Number(reciboDeHoy.carbs)}
            total={reciboDeHoy.carbs} 
            infoLista={carbButtons} 
            screenSize={screenSize} 
            ebooklista={carbEbooks} 
            />
        } 
        />    

        {screenSize != "" && <CustomCard mb="50px" mt="10px" hijo={ 
              <FiberCard edit={false} reciboObjetivo={Number(reciboObjetivo.fibra) - Number(reciboDeHoy.fibra)}
              totalFiber={reciboDeHoy.fibra} screenSize={screenSize}
              ebooklista={fiberEbooks}
              ></FiberCard>}></CustomCard>}


        </>} 

       </Flex>} 


      {macroPorcentaje == null && <PurpleSpinner></PurpleSpinner>} 
      </>
    );

}
