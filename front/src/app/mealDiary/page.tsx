'use client';
// Chakra imports
import {
  Box,
  Button,
  Card,
  Flex,
  FormLabel,
  HStack,
  IconButton,
  Input,
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
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import CustomCard from '@/components/global/cards/CustomCard';
import { aminoacidBtnNumber, aminoacidBtnText, API_URL, calcularPorcentaje, calcularPorcentajes, complexCarbsBtnNumber, complexCarbsBtnText, crearRecibo, dameDatosDelRecibo, fiberBtnNumber, fiberBtnText, formatDateToISOFriendly, getFecha, getTamanyoPantalla, proteinBtnNumber, proteinBtnText, redirigirSiNoHayUserNom, simpleCarbsBtnNumber, simpleCarbsBtnText, typesOfFatBtnNumber, typesOfFatBtnText } from '../../GlobalHelper';
import MacroCalView from '@/components/myday/MacroCalView';
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import { macroPorcentajes, reciboSkeleton, showMacroNutrSignUp } from '../../../../backend/src/dto/recibos.dto';
import { showEbook } from '../../../../backend/src/dto/ebook.dto';
import FiberCard from '@/components/global/cards/FiberCard';
import { PieChardMacroNutr } from '@/components/global/cards/PieChardMacroNutr';
import InputField from '@/components/global/random/InputField';
import EBookButton from '@/components/global/random/EBookButton';
import { diasSkeleton } from '../../../../backend/dist/src/dto/dias.dto';
import { CaloryIcon } from '@/components/icons/CaloryIcon';
import { PieChardMacroNutr2 } from '@/components/global/cards/PieChardMacroNutr2';
import BarraMenu from '@/components/global/BarraMenu';
import { useRouter } from 'next/navigation';
import FidelidadCard from '@/components/fidelity/FidelidadCard';

///////////////// ESTRATEGIA /////////////////
// va a coger todos los dias_ids y los va a guardar
// cuando el user vaya a atras o hacia delante se mostraran los datos
// se muestra vacio si no hay nada

export default function mealDiary() 
{
  const router = useRouter();
  const dia = useRef<diasSkeleton | null>(null);
  const userNom = useRef<string>("");
  const idsFechas = useRef<number[]>([]); // se guardan por orden cronológico

  // lleva cuenta del id de la fecha en la q estamos
  const [idFecha, setidFecha ] = useState<number>(-1);
  const [fecha, setfecha ] = useState<string>("");

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

  // y el porcentaje aqui
  const [macroPorcentaje, setmacroPorcentajes ] = useState< macroPorcentajes | null >(null);
  const [pieChardData, setpieChardData ] = useState<number[]>([20, 40, 30, 10]);
  const [calorias, setcalorias ] = useState<string>("");

  const [reciboObjetivo, setreciboObjetivo ] = useState< reciboSkeleton | null >(null);

  // esconde boton de la der o izq porq ya no hay más días que ver
  const [verFlecha, setverFlecha ] = useState<number>(2); // 0 ve las dos, 1 no ve la de la izq y 2 no ve la de la der
 
  ///////////////////// END DECLARATIONS /////////////////////



  // 0: encuentra datos en el ss
  useEffect(() => 
  {
    redirigirSiNoHayUserNom();
    dia.current=null;
    getTamanyoPantalla(setscreenSize)
    let userNomm = sessionStorage.getItem("userNom");
    if(userNomm)
    {
      userNom.current = userNomm;
      getDiasIds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1: coge todos los dias_ids
  const getDiasIds = async () => 
  {
    try{
      const response = await axios.get(
        `${API_URL}/dias/allDias_ids/${userNom.current}`,
        {
          headers: {
              'Content-Type': 'application/json'
          },
        }
      );
      if(response.data.diaId)
      {
        idsFechas.current = response.data.diaId;
        // coge del ss el id Dia de hoy (q deberia de ser igual al ultimo de la lista) y lo muestra
        let diaHoy = sessionStorage.getItem("diaId")
        if(diaHoy)
          setidFecha(parseInt(diaHoy, 10));
        else
          setidFecha(parseInt(response.data.diaId[response.data.diaId.length-1], 10));
        //si Hoy no existe, muestra el ultimo de la lista
      }
    }
      catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // 2: ya tenemos el id del dia q tenemos q mostrar
  useEffect(() => 
  {
    const cogeDiaYRecibo = async () =>
    {
      calculaComportamientoFlechas();

      let diaObjeto = await dameDiaConcreto(idFecha);
      if (diaObjeto.dia[0]) 
      {
        setcalorias(diaObjeto.dia[0].calorias_total)
        setfecha(diaObjeto.dia[0].fecha)
        let reciboObj = sessionStorage.getItem("reciboObjetivo")
        if(reciboObj)
          await dameDatosDelRecibo(parseInt(reciboObj, 10), setreciboObjetivo);

        await dameDatosDelRecibo(diaObjeto.dia[0].recibo_id, setreciboDeHoy);
      } 
      else 
      {
        setmacroPorcentajes({
          prote:0,
          grasas:0,
          carbs:0,
          fibra:0 });
          setpieChardData([20, 40, 30, 10])
          dia.current = null;
      }
    };

    if(idFecha != -1)
      cogeDiaYRecibo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idFecha]);

  // 3: si todo ha ido bien el reciboHoy deberia de haber cambiado
  useEffect(() => 
  {
    // ahora ya podemos poner los datos del primer bloque
    if(reciboDeHoy && reciboObjetivo)
    {
      let protePorcentaje = calcularPorcentaje(parseInt(reciboDeHoy.prote, 10), parseInt(reciboObjetivo.prote, 10))
      let fatPorcentaje = calcularPorcentaje(parseInt(reciboDeHoy.grasas, 10), parseInt(reciboObjetivo.grasas, 10))
      let carbsPorcentaje = calcularPorcentaje(parseInt(reciboDeHoy.carbs, 10), parseInt(reciboObjetivo.carbs, 10))
      let fibraPorcentaje = calcularPorcentaje(parseInt(reciboDeHoy.fibra, 10), parseInt(reciboObjetivo.fibra, 10))
      
      setmacroPorcentajes({
        prote:protePorcentaje,
        grasas:fatPorcentaje,
        carbs:carbsPorcentaje,
        fibra:fibraPorcentaje
      }); 
      

      let lista = [parseInt(reciboDeHoy.prote == "" ? "0" : reciboDeHoy.prote, 10), 
      parseInt(reciboDeHoy.grasas == "" ? "0" : reciboDeHoy.grasas, 10), 
      parseInt(reciboDeHoy.carbs == "" ? "0" : reciboDeHoy.carbs, 10), 
      parseInt(reciboDeHoy.fibra == "" ? "0" : reciboDeHoy.fibra, 10)]

      let porcentajes = calcularPorcentajes(lista)
      if (porcentajes.every(num => isNaN(num))) 
      {
        setpieChardData([20, 40, 30, 10])
      }
      else
        setpieChardData(porcentajes)
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reciboDeHoy, reciboObjetivo]);

  const dameDiaConcreto = async (idDia:number) =>
  {
    try{
      const response = await axios.get(
        `${API_URL}/dias/dia/${idDia}`,
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

  const cogeDiaAnterior = () =>
  {
    let index = idsFechas.current.indexOf(idFecha);
    // if(index-1 == 0)
    //   setverFlecha(1)
    // else
    //   setverFlecha(0)
    if(idsFechas.current[index-1])
      setidFecha(idsFechas.current[index-1])
  };

  const cogeDiaPosterior = () =>
  {
    let index = idsFechas.current.indexOf(idFecha);
    // if(index+1 == idsFechas.current.length)
    //   setverFlecha(2)
    // else
    //   setverFlecha(0)
    if(idsFechas.current[index+1])
      setidFecha(idsFechas.current[index+1])
  };

  // dependiendo del dia en el q estemos y la cantidad de dias mas q hay, salen las 2 flechas o no
  const calculaComportamientoFlechas = () =>
  {
    // simula q es el resultado final (esta estrategia no se puede hacer con variables de estado)
    let flechaSimula = -1;

    // coger index del dia en el q estamos
    let index = idsFechas.current.indexOf(idFecha);

    // si hay dias antes q el, mostrar flecha izq
    if(idsFechas.current[index-1])
      flechaSimula = 1; // se puede ver la flecha izq

    // si hay dias despues de el, mostrar felcha der
    if(idsFechas.current[index+1])
    {
      if(flechaSimula == 1)
        flechaSimula = 0; // se pueden ver las 2
      else
        flechaSimula = 2; // solo se puede ver la izq
    }

    setverFlecha(flechaSimula)
  };




// #region EBOOKS 
   const proteinEbooks: showEbook[] = [
         {
             title: proteinBtnText,
             onclick: undefined,
             type: proteinBtnNumber
         },
         {
             title: aminoacidBtnText,
             onclick: undefined,
             type: aminoacidBtnNumber
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
               title: typesOfFatBtnText,
               onclick: undefined,
               type:typesOfFatBtnNumber
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
           title: complexCarbsBtnText,
           onclick: undefined,
           type: complexCarbsBtnNumber
         },
          {
           title: simpleCarbsBtnText,
           onclick: undefined,
           type: simpleCarbsBtnNumber
         }
         ];
     
         const fiberEbooks: showEbook[] = [
         {
             title: fiberBtnText,
             onclick: undefined,
             type: fiberBtnNumber
         }
         ];
         
         let carbButtons: showMacroNutrSignUp[] = [];
         
         if (reciboDeHoy != null) {
         carbButtons = [
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
      {macroPorcentaje!= null && screenSize!="" && idFecha!= -1 &&fecha!=""&&
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
           <HStack justify="center" width="100%" align="center" position="relative">
              {/* Botón con flecha hacia la izquierda */}
         
              <IconButton
                icon={<ArrowLeftIcon />}
                aria-label="Go Left"
                disabled={verFlecha == 1 || verFlecha == 0 ? false: true}
                onClick={cogeDiaAnterior}
                variant="ghost"
                position="absolute"
                left={0} // Fija la posición a la izquierda
              />
         

              {/* Contenido Central */}
              <VStack alignItems="center">
                <Text color="black" fontSize="2xl" fontWeight="700">
                  MEAL DIARY
                </Text>
                <HStack spacing="5px" alignItems="center">
                  {/* Ícono SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#000000"
                  >
                    <path d="M202.87-71.87q-37.78 0-64.39-26.61t-26.61-64.39v-554.26q0-37.78 26.61-64.39t64.39-26.61H240v-80h85.5v80h309v-80H720v80h37.13q37.78 0 64.39 26.61t26.61 64.39v554.26q0 37.78-26.61 64.39t-64.39 26.61H202.87Zm0-91h554.26V-560H202.87v397.13Zm0-477.13h554.26v-77.13H202.87V-640Zm0 0v-77.13V-640Z" />
                  </svg>

                  {/* Texto */}
                  <Text color="black" fontSize="md" fontWeight="700">
                    {formatDateToISOFriendly(fecha)}
                  </Text>
                </HStack>
              </VStack>

              {/* Flecha hacia la derecha */}

              <IconButton
                icon={<ArrowRightIcon />}
                aria-label="Go Right"
                disabled={verFlecha == 2 || verFlecha == 0 ? false: true}
                onClick={cogeDiaPosterior}
                variant="ghost"
                position="absolute"
                right={0} // Fija la posición a la derecha
              />

            </HStack>

        </Card>

       {/* calorias y macronutrients overall view */}
        <CustomCard mt="20px" hijo={
          <>
            <Box mb={{ base: "10px", md: "20px" }} alignItems={"center"} justifyContent={"center"}>
              <Flex
                  justify="center"  // Centra los elementos horizontalmente
                  align="center"    // Centra los elementos verticalmente
              >
                  <SimpleGrid
                    w={{ base: "100%", md: "70%" }}  
                    columns={{ base: 1, md: 2 }} 
                    spacing={{ base: "20px", md: "120px" }} 
                  >
                    <Box w={{ base: "200px", md: "280px" }} justifyContent={{ base: "center", md: "space-between" }}  mt={{ base: "0px", md: "25px", xl: "25px" }} mb={{ sd: "30px", md: "0px" }} ml={{ base: "20px", md: "-70px" }}>
                      <PieChardMacroNutr2 pieChartData={pieChardData} calories={calorias} />
                    </Box>

                    <VStack w={{ base: "220px", md: "250px" }}  justifyContent={{ base: "center" }} alignItems={{ base: "center"}} >
                      <MacroCalView macroPorcentaje={macroPorcentaje} />
                      <Button
                        fontSize="sm"
                        borderRadius="16px"
                        bg="purple.100"
                        w="70%"  // Set to 100% width to stretch across the container
                        h="40px"
                        p="10px"
                        color="black"
                        _hover={{ bg: "gray.100" }}
                        onClick={() => location.href = `../foodList?diaId=${idFecha}`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        FOOD LIST
                      </Button>
                    </VStack>
                  </SimpleGrid>
              </Flex>
            </Box>
          </>
        }></CustomCard>

        <CustomCard mt="10px" hijo={ 
          <>
            <FidelidadCard soloLeer={true} diaId={dia.current?.fidelidad_id ? dia.current?.fidelidad_id : null}></FidelidadCard>
          </>
        }>
        </CustomCard>
       
   
        <CustomCard mt="10px" p="20px" hijo={ 
            <>
            <Text color={"black"} fontSize="xl" w="100%"  fontWeight="700" textAlign="center">
                MACRONUTRIENTS
            </Text>
            </>
        }>
        </CustomCard>

        <CustomCard mt="10px" hijo={ 
            <MacroNutrCard title={'PROTEINS'} total={reciboDeHoy.prote}  screenSize={screenSize}  infoLista={proteinButtons} ebooklista={proteinEbooks}></MacroNutrCard>} >
        </CustomCard>

        <CustomCard mt="10px"
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
    
        <CustomCard mt="10px"
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

        {screenSize != "" && <CustomCard mb="50px" mt="10px" hijo={ 
        <FiberCard edit={false} stillNeed={false} ebooklista={fiberEbooks} totalFiber={reciboDeHoy.fibra} screenSize={screenSize}></FiberCard>}></CustomCard>}
      </Flex>}  

      {macroPorcentaje == null && <PurpleSpinner></PurpleSpinner>} 
    </>
  );

}
