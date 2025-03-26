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
import CustomCard from '@/components/global/cards/CustomCard';
import { API_URL, cogeFichaDeUserNom, crearRecibo, dameDatosDelRecibo, formatDateToISOFriendly, getFecha, getInternetDateParts, getTamanyoPantalla, redirigirSiNoHayNutriNom, redirigirSiNoHayUserNom, userNutriId } from '../../../../GlobalHelper';
import ElementoPrimero from '@/components/myday/ElementoPrimero';
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import FiberCard from '@/components/global/cards/FiberCard';
import { macroPorcentajes, reciboSkeleton, showMacroNutrSignUp } from '../../../../../../backend/src/dto/recibos.dto';
import { showEbook } from '../../../../../../backend/src/dto/ebook.dto';
import { colorNutricionist } from '@/GlobalHelper';
import GreenSpinner from '@/components/global/random/GreenSpinner';
import BarraMenuNutri from '@/components/nutritionist/BarraMenuNutri';



export default function MyPatientDay() 
{
  const patientNomSeleccionado = useRef<string>("");
  const [screenSize, setscreenSize ] = useState<string>("");
  const [diaExiste, setdiaExiste ] = useState<boolean | undefined>(undefined);

  // lo q el usuario consume en 1 dia se guarda aqui
  const [reciboDeHoy, setreciboDeHoy  ] = useState< reciboSkeleton | null >(null);
  const [reciboObjetivo, setreciboObjetivo ] = useState< reciboSkeleton | null >(null);

  // calorias
  const caloriasObj = useRef<string>("");
  const caloriasHoy = useRef<string>("");

  // y el porcentaje aqui
  const [macroPorcentaje, setmacroPorcentajes ] = useState< macroPorcentajes | null >(null);

  const fecha = useRef<string>("");
  ///////////////////// END DECLARATIONS /////////////////////
  


  // 0: mira si ya hay recibo y calorias para el dia de hoy, si no lo hay lo crea
  useEffect(() => 
  {
    redirigirSiNoHayNutriNom()
    getTamanyoPantalla(setscreenSize)
    let patient = sessionStorage.getItem("patientTratando");
    if(patient)
    {
        patientNomSeleccionado.current = patient;
        cogeDatosUserSeleccionado(patient)
    }
    else
    {
        location.href = "./main"
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cogeDatosUserSeleccionado = async (patientNom:string) =>
  {
    // coge el dia de hoy
    let fechaFunc = await getFecha();
    fecha.current = fechaFunc;

    // busca en el id del user el array de dias q tiene
    // busca si hay dia q se corresponde con dia de hoy
    // si es asi, lo muestra (cogiendo TODO, calorias y recibo)
    let diaHoyDePatient = await buscaidDiaHoyDePatient(fechaFunc);
    if(diaHoyDePatient!= undefined)
    {
      setdiaExiste(true)
      caloriasHoy.current = diaHoyDePatient.calorias_total;

      let ficha = await cogeFichaDeUserNom(patientNom);
      caloriasObj.current = ficha.calorias_objetivo;

      await dameDatosDelRecibo(diaHoyDePatient.recibo_id , setreciboDeHoy);
      await dameDatosDelRecibo(ficha.recibo_id , setreciboObjetivo);
    }
    else
      setdiaExiste(false)
  };

  const buscaidDiaHoyDePatient = async (fecha:string) =>
  {
    try
    {
      const response = await axios.get(
      `${API_URL}/usuarios/patientDiaHoy/${patientNomSeleccionado.current}/${fecha}`,
      {
        headers: {
            'Content-Type': 'application/json'
        },
      }
      );
      if(response.data != null)
      {
        return response.data[0];
      }
    }
    catch (error) {
        console.log('Error fetching data:', error);
    }
  };



  useEffect(() => 
  {
    if(reciboDeHoy)
    {
      setmacroPorcentajes({
        prote:Number(reciboDeHoy.prote),
        grasas:Number(reciboDeHoy.grasas),
        carbs: Number(reciboDeHoy.carbs),
        fibra:Number(reciboDeHoy.fibra)
    })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reciboDeHoy]);


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
    {diaExiste==false &&
    <Flex
        direction="column"
        align="center"
        bg={colorNutricionist}
        w="100%"
        h="100%"
        justify="center"
        p="30px"
        minH="100vh"
        position={"relative"}
    >
      <CustomCard mt="0px" p="20px" hijo={ 
        <Text color="red">Your patient doesn't have "Today" created</Text>
      }></CustomCard>

    </Flex>}
    {macroPorcentaje!= null && reciboDeHoy && diaExiste==true &&
      <Flex
        direction="column"
        align="center"
        bg={colorNutricionist}
        w="100%"
        h="100%"
        justify="center"
        p="30px"
        minH="100vh"
        position={"relative"}
    >

      <BarraMenuNutri></BarraMenuNutri>

      {/* title: nombre y dia de hoy */}
      <CustomCard mt="0px" p="20px" hijo={ 
        <>
            <Text fontSize="md" textAlign="center">My patient:</Text>
            <Text fontSize="3xl" fontWeight="bold" textAlign="center">{patientNomSeleccionado.current}</Text>
        </>
      }></CustomCard>
      <Card
          width={{ base: "40%", md: "50%" }}
          height="auto"
          mt="10px"
          maxWidth="400px"
          p="10px"
          align="center"
          justify="center"
          borderRadius={"20px"}
          >
          <HStack justify="center" width="50%" align="center">
              {/* Contenido Central */}
              <VStack alignItems={"center"}>
              <HStack spacing="5px" alignItems="center">
              {/* Ícono SVG */}

                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000">
                  <path d="M202.87-71.87q-37.78 0-64.39-26.61t-26.61-64.39v-554.26q0-37.78 26.61-64.39t64.39-26.61H240v-80h85.5v80h309v-80H720v80h37.13q37.78 0 64.39 26.61t26.61 64.39v554.26q0 37.78-26.61 64.39t-64.39 26.61H202.87Zm0-91h554.26V-560H202.87v397.13Zm0-477.13h554.26v-77.13H202.87V-640Zm0 0v-77.13V-640Z"/>
                </svg>
              {/* Texto */}
              <Text color={"black"} fontSize="md" fontWeight="700">
                {formatDateToISOFriendly(fecha.current)}
              </Text>
            </HStack>
              </VStack>
          </HStack>
      </Card>

       {/* calorias y macronutrients overall view */}
        <CustomCard mt="20px" hijo={<ElementoPrimero 
        caloriasObj={caloriasObj.current} 
        caloriasHoy={caloriasHoy.current}
        macroPorcentaje={macroPorcentaje}></ElementoPrimero>}></CustomCard> 

        { reciboObjetivo!= null && <>
        <CustomCard mt="10px" p="15px" hijo={ 
            <>
            <Text color={"black"} fontSize="xl" w="100%"  fontWeight="700" textAlign="center">
                TODAY'S MACRONUTRIENTS
            </Text>
            </>
        }>
        </CustomCard>

        <CustomCard mt="10px" hijo={ 
            <MacroNutrCard title={'PROTEINS'} verMensajesNutri={true} stillNeed={true}
            reciboObjetivo={Number(reciboObjetivo.prote) - Number(reciboDeHoy.prote)} 
            total={reciboDeHoy.prote}  screenSize={screenSize} 
            infoLista={proteinButtons} ebooklista={proteinEbooks}></MacroNutrCard>} >
        </CustomCard>

        <CustomCard mt="10px"
        hijo={ 
            <MacroNutrCard 
            title={'FATS'} verMensajesNutri={true}
            reciboObjetivo={Number(reciboObjetivo.grasas) - Number(reciboDeHoy.grasas)}
            total={reciboDeHoy.grasas} 
            infoLista={fatButtons} 
            screenSize={screenSize} 
            stillNeed={true}
            ebooklista={fatEbooks} 
            />
        } 
        />
    
        <CustomCard mt="10px"
        hijo={ 
            <MacroNutrCard 
            title={'CARBS'} verMensajesNutri={true}
            reciboObjetivo={Number(reciboObjetivo.carbs) - Number(reciboDeHoy.carbs)}
            total={reciboDeHoy.carbs} 
            infoLista={carbButtons} 
            screenSize={screenSize} 
            stillNeed={true}
            ebooklista={carbEbooks} 
            />
        } 
        />    

        {screenSize != "" && <CustomCard mb="50px" mt="10px" hijo={ 
              <FiberCard edit={false} verMensajesNutri={true} stillNeed={true} reciboObjetivo={Number(reciboObjetivo.fibra) - Number(reciboDeHoy.fibra)}
              totalFiber={reciboDeHoy.fibra} screenSize={screenSize}
              ebooklista={fiberEbooks}
              ></FiberCard>}></CustomCard>}
        </>} 
       </Flex>} 
      {macroPorcentaje == null && <GreenSpinner></GreenSpinner>} 
      </>
    );

}
