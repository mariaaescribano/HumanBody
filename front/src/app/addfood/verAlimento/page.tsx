'use client';
// Chakra imports
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Icon,
  IconButton,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import NatureIcon from '@mui/icons-material/Nature';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import SelectSignIn from '@/components/signin/SelectSignIn';
import PopUpMessage from '@/components/global/message/PopUpMessage';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';
import PurpleSpinner from '@/components/global/random/Spinner';
import CustomCard from '@/components/global/cards/CustomCard';
import { API_URL, calcularPorcentajes, crearRecibo, esSoloNumeros, getTamanyoPantalla } from '../../../../GlobalHelper';
import { alimentosSkeleton, miniCartaAlimento } from '../../../../../backend/src/dto/alimentos.dto';

import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';

import MacroNutrCardEdit from '@/components/addfood/crearAlimento/MacroNutrCardEdit';
import { MdCheck } from 'react-icons/md';
import { reciboSkeleton, reciboConstNames, showMacroNutrSignUp } from '../../../../../backend/src/dto/recibos.dto';
import SuccessErrorMessage from '@/components/global/message/SuccessErrorMessage';
import FiberCard from '@/components/global/cards/FiberCard';
import InputField from '@/components/global/random/InputField';
import { PieChardMacroNutr } from '@/components/global/cards/PieChardMacroNutr';
import CalorGramsSelectCard from '@/components/addfood/verAlimento/CalorGramsSelectCard';
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import { showEbook } from '../../../../../backend/src/dto/ebook.dto';
import { ProteinsName } from '@/components/Names/ProteinName';

export default function VerAlimento() 
{
  const [alimento, setalimento ] = useState<alimentosSkeleton | null>(null);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [screenSize, setscreenSize ] = useState<string>("");

  // aqui se guarda los valores por 100 gr del alimento
  const [reciboOriginal, setreciboOriginal ] = useState< reciboSkeleton >(
    {
      grasas:"",
      monoinsaturadas:"",
      poliinsaturadas:"",
      saturadas:"",
      prote:"",
      incompleto:"",
      completo:"",
      carbs:"",
      complejos:"",
      simples:"",
      fibra:""
    }
  );

  // aqui se guardan los valores personalizados dependiendo de los gramos q ponga el user
  // empiezan siendo igual a los originales ( gramos por defecto son 100 )
  const [reciboPersonalizado, setreciboPersonalizado ] = useState< reciboSkeleton >(
    {
      grasas:"",
      monoinsaturadas:"",
      poliinsaturadas:"",
      saturadas:"",
      prote:"",
      incompleto:"",
      completo:"",
      carbs:"",
      complejos:"",
      simples:"",
      fibra:""
    }
  );

  const [calories, setcalories ] = useState<string>("");

  // what user ate
  const [grams, setgrams ] = useState<string>("100");

  const [btnfinishedPulsado, setbtnfinishedPulsado ] = useState<boolean>(false);
  const [mensajeError, setmensajeError ] = useState<boolean| undefined>(undefined);

  // se actualiza solo una vez, con los valores originales (no sentido q cambie)
  const [pieChardData, setpieChardData ] = useState<number[]>([]);
  


  // 0: coge id y tamaño pantalla
  useEffect(() => 
  {
    getTamanyoPantalla(setscreenSize)

    const queryParams = new URLSearchParams(location.search);
    const idAlimento = queryParams.get('idAlimento') || '';

    dameDatosDeAlimento(parseInt(idAlimento, 10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1: coge alimento de BD
  const dameDatosDeAlimento = async (idAlimento:number) =>
  {
    try{
    const response = await axios.get(
      `${API_URL}/alimentos/alimento/${idAlimento}`,
      {
        headers: {
            'Content-Type': 'application/json'
        },
      }
    );
      if(response.data != null)
      {
        setalimento(response.data.alimento[0])
        setcalories(response.data.alimento[0].calorias_100gr)
        dameReciboDeAlimento(response.data.alimento[0].recibo_id);
      }
    }
    catch (error) {
    console.error('Error fetching data:', error);
    }
  };

  // 2: coge el recibo para acceder a sus datos nutricionales
  const dameReciboDeAlimento = async (idRecibo:number) =>
  {
    try{
    const response = await axios.get(
      `${API_URL}/recibos/recibo/${idRecibo}`,
      {
        headers: {
            'Content-Type': 'application/json'
        },
      }
    );
      if(response.data != null)
      {
        let recibo = response.data.recibo[0];
       
        setreciboOriginal(recibo)
        setreciboPersonalizado(recibo)
        setpieChardData([parseInt(recibo.prote, 10), parseInt(recibo.grasas, 10), parseInt(recibo.carbs, 10), parseInt(recibo.fibra, 10)])
      }
    }
    catch (error) {
    console.error('Error fetching data:', error);
    }
  };


  // cada vez q los gramos cambien, las calorias y macros deben de ser actualizadas
  useEffect(() => 
  {
    if(calories!= "" && alimento && reciboPersonalizado)
    {
      // actualiza calorias
      let caloriasPorGramos = reglaDeTres(100, parseInt(alimento?.calorias_100gr, 10), parseInt(grams, 10));
      setcalories(Math.round(caloriasPorGramos).toString());

      // actualiza macros
      let proteNuevos = reglaDeTres(100, parseInt(reciboOriginal?.prote, 10), parseInt(grams, 10));
      let completoNuevos = reglaDeTres(100, parseInt(reciboOriginal?.completo, 10), parseInt(grams, 10));
      let incompletoNuevos = reglaDeTres(100, parseInt(reciboOriginal?.incompleto, 10), parseInt(grams, 10));
      let monoNuevos = reglaDeTres(100, parseInt(reciboOriginal?.monoinsaturadas, 10), parseInt(grams, 10));
      let poliinsaturadasNuevos = reglaDeTres(100, parseInt(reciboOriginal?.poliinsaturadas, 10), parseInt(grams, 10));
      let saturadasNuevos = reglaDeTres(100, parseInt(reciboOriginal?.saturadas, 10), parseInt(grams, 10));
      let carbsNuevos = reglaDeTres(100, parseInt(reciboOriginal?.carbs, 10), parseInt(grams, 10));
      let grasasNuevos = reglaDeTres(100, parseInt(reciboOriginal?.grasas, 10), parseInt(grams, 10));
      let simplesNuevos = reglaDeTres(100, parseInt(reciboOriginal?.simples, 10), parseInt(grams, 10));
      let complejosNuevos = reglaDeTres(100, parseInt(reciboOriginal?.complejos, 10), parseInt(grams, 10));
      let fibraNuevos = reglaDeTres(100, parseInt(reciboOriginal?.fibra, 10), parseInt(grams, 10));

      const nuevoReciboPersonalizado : reciboSkeleton =
      {
        grasas: Math.round(grasasNuevos).toString(),
        monoinsaturadas: Math.round(monoNuevos).toString(),
        poliinsaturadas: Math.round(poliinsaturadasNuevos).toString(),
        saturadas:Math.round(saturadasNuevos).toString(),
        prote: Math.round(proteNuevos).toString(),
        incompleto: Math.round(incompletoNuevos).toString(),
        completo: Math.round(completoNuevos).toString(),
        carbs: Math.round(carbsNuevos).toString(),
        complejos: Math.round(complejosNuevos).toString(),
        simples: Math.round(simplesNuevos).toString(),
        fibra: Math.round(fibraNuevos).toString()
      };

      setreciboPersonalizado(nuevoReciboPersonalizado)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grams]);
  

  function reglaDeTres(valorA:number, valorB:number, valorC:number) {
    return (valorB * valorC) / valorA;
  }
  
  




   // listas usadas para mostrar datos
  
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

    if (reciboPersonalizado != null) 
    {
        proteinButtons = [
            { 
            label: "Complete proteins", 
            price: `${reciboPersonalizado.completo == "" ? 0 : reciboPersonalizado.completo} grams`, 
            tooltip: "Contain all essential amino acids your body needs for regeneration." 
            },
            { 
            label: "Incomplete proteins", 
            price: `${reciboPersonalizado.incompleto} grams`, 
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
    
    if (reciboPersonalizado != null) {
        fatButtons = [
            {
            label: "Monounsaturated",
            price: `${reciboPersonalizado.monoinsaturadas} grams`,
            tooltip: "Heart-friendly fats that support cholesterol balance and overall health."
            },
            {
            label: "Polyunsaturated",
            price: `${reciboPersonalizado.poliinsaturadas} grams`,
            tooltip: "Essential fats, including omega-3 and omega-6, crucial for brain and cell function."
            },
            {
            label: "Saturated",
            price: `${reciboPersonalizado.saturadas} grams`,
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
    
    if (reciboPersonalizado != null) {
    carbButtons = [
        // {
        // label: "Fiber",
        // price: `${recibo.fibra} grams`,
        // tooltip: "Fiber promotes healthy digestion, supports heart health, helps regulate blood sugar levels and supports neuron and brain activity."
        // },
        {
        label: "Complex",
        price: `${ Math.round(parseInt(reciboPersonalizado.complejos, 10)) } grams`,
        tooltip: "Provide long-lasting energy and fiber, digesting slowly."
        },
        {
        label: "Simples",
        price: `${reciboPersonalizado.simples} grams`,
        tooltip: "Digest quickly, giving a fast but short energy boost."
        }
    ];
    }


  


  return (
    <>
      {screenSize != "" && alimento!= null && reciboPersonalizado &&
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


        {/* titulo */}
      {mensajeError == true &&<PopUpErrorMessage title={'Error'} texto={'Please, fill up all the data'}></PopUpErrorMessage>}
        <CustomCard hijo={ 
          <>
          <Flex justify="start" gap="5px" align="center" mb="10px">
            <VStack>
            <Text color={textColor} fontSize="sm" fontWeight="700">
                Adding food:
            </Text>

            <Text color={textColor} fontSize="2xl" fontWeight="700">
              {alimento.nombre}
            </Text>
            </VStack>
          </Flex>

          <Box w="100%" borderBottom="2px solid black" my="20px" />

          <HStack>
            <Button
                variant="darkBrand"
                fontSize="sm"
                borderRadius="16px"
                bg="purple.100"
                w={{ base: '128px', md: '148px' }}
                h="46px"
                _hover={{ bg: "gray.100" }}
                onClick={() => location.href = "./buscarAlimento"}
            >
              X  CANCEL
            </Button>
            <Button
                variant="darkBrand"
                fontSize="sm"
                borderRadius="16px"
                bg="purple.100"
                w={{ base: '128px', md: '148px' }}
                h="46px"
                isDisabled ={btnfinishedPulsado } // esta disabled cuando se le ha dado al boton, para no darle mas veces
                _hover={{ bg: 'gray.100' }}
                // onClick={finish}
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>}
              >
                ADD
                {btnfinishedPulsado==true && (
                  <Spinner
                    size="sm"
                    ml={4}
                    color="white"
                  />
                )}
              </Button>
            </HStack>
            {mensajeError == false && <SuccessErrorMessage status={'success'} title={'Food created!'}></SuccessErrorMessage>} 
          
        </> }></CustomCard>


        <CustomCard hijo={ 
          <>
            <Box mb={{ base: '20px', md: '20px' }}>
              <SimpleGrid columns={{ base: 1, md: 2 }}>
                <CalorGramsSelectCard calories={calories} grams={grams} setgrams={setgrams}></CalorGramsSelectCard>
                {pieChardData.length > 0 && <Box w={{ base: '200px', md: '100%' }}  mt={{ base: "20px", md: "0px" }}>
                  <PieChardMacroNutr pieChartData={pieChardData} />
                </Box>}
              </SimpleGrid>
            </Box>
          </>
        }></CustomCard>

        {screenSize != "" && 
        <CustomCard hijo={ 
        <MacroNutrCard title={"PROTEINS"} total={reciboPersonalizado.prote == "" ? "0" : Math.round(parseInt(reciboPersonalizado.prote,10)).toString()} infoLista={proteinButtons} screenSize={screenSize} ebooklista={[]}></MacroNutrCard>}>
        </CustomCard>}

        {screenSize != "" && 
        <CustomCard hijo={ 
        <MacroNutrCard title={"FATS"} total={reciboPersonalizado.grasas == "" ? "0" : Math.round(parseInt(reciboPersonalizado.grasas,10)).toString()} infoLista={fatButtons} screenSize={screenSize} ebooklista={[]}></MacroNutrCard>}>
        </CustomCard>}

        {screenSize != "" && 
        <CustomCard hijo={ 
        <MacroNutrCard title={"CARBS"} total={reciboPersonalizado.carbs == "" ? "0" : Math.round(parseInt(reciboPersonalizado.carbs,10)).toString()} infoLista={carbButtons} screenSize={screenSize} ebooklista={[]}></MacroNutrCard>}>
        </CustomCard>}
    
        {screenSize != "" && <CustomCard hijo={ 
        <FiberCard edit={false} totalFiber={reciboPersonalizado.fibra == "" ? "0" : Math.round(parseInt(reciboPersonalizado.fibra,10)).toString()} screenSize={screenSize}></FiberCard>}></CustomCard>}

    </Flex>}

      {screenSize == "" && pieChardData.length == 0 && <PurpleSpinner></PurpleSpinner>}
    </>);

}
