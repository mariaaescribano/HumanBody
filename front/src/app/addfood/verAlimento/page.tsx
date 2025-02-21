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
import { reciboSkeleton, reciboConstNames } from '../../../../../backend/src/dto/recibos.dto';
import SuccessErrorMessage from '@/components/global/message/SuccessErrorMessage';
import FiberCard from '@/components/global/cards/FiberCard';
import InputField from '@/components/global/random/InputField';
import { PieChardMacroNutr } from '@/components/global/cards/PieChardMacroNutr';

export default function CrearAlimento() 
{
  const [alimento, setalimento ] = useState<alimentosSkeleton | null>(null);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [screenSize, setscreenSize ] = useState<string>("");
  const foodName = useRef<string>("");


  const [calories, setcalories ] = useState<string>("");


  const [btnfinishedPulsado, setbtnfinishedPulsado ] = useState<boolean>(false);


  const [mensajeError, setmensajeError ] = useState<boolean| undefined>(undefined);


  const [pieChardData, setpieChardData ] = useState<number[]>([20, 40, 40]);

  const [recibo, setrecibo ] = useState< reciboSkeleton >(
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
        dameReciboDeAlimento(response.data.alimento[0].recibo_id);
      }
    }
    catch (error) {
    console.error('Error fetching data:', error);
    }
  };

  const dameReciboDeAlimento = async (idAlimento:number) =>
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
      }
    }
    catch (error) {
    console.error('Error fetching data:', error);
    }
  };
  


  


  return (
    <>
      {screenSize != "" && alimento!= null && recibo &&
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
          {/* SimpleGrid ajusta las columnas según el tamaño de la pantalla */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
            <VStack >
                <InputField
                mb="20px"
                onChange= {(e:any) => foodName.current = e.target.value}
                id="first"
                placeholder="Apple"
                label="Food Name"
                />
                <HStack ml="30px">
                    <InputField
                    mb="0px"
                    // onChange= {(e:any) => { cambiaCalories(e)  }}
                    id="second"
                    value={ calories }
                    placeholder="57"
                    label="Calories per 100 grams"
                    />
                    <Text mt="30px">kcal</Text>
                </HStack>         
            </VStack>

            <Box w={{ base: '200px', md: '100%' }} ml={{ base: "30px", md: "0px" }}>
              <PieChardMacroNutr pieChartData={pieChardData} />
            </Box>
          </SimpleGrid>

          {/* Centrar el componente CircProgressMacroEdit */}
        
        </Box>

        </>}></CustomCard>

        {screenSize != "" && <CustomCard hijo={ 
        <MacroNutrCardEdit recibo={recibo} setrecibo={setrecibo} 
        totalMacro={reciboConstNames.prote} 
        screenSize={screenSize} 
        infoLista={[reciboConstNames.completo, reciboConstNames.incompleto]}>
        </MacroNutrCardEdit>}></CustomCard>}
        
        {screenSize != "" && <CustomCard hijo={ <MacroNutrCardEdit recibo={recibo} setrecibo={setrecibo} totalMacro={reciboConstNames.grasas} screenSize={screenSize} infoLista={[reciboConstNames.monoinsaturadas,reciboConstNames.poliinsaturadas, reciboConstNames.saturadas]}></MacroNutrCardEdit>}></CustomCard>}

        {screenSize != "" &&  <CustomCard hijo={  <MacroNutrCardEdit recibo={recibo} setrecibo={setrecibo} totalMacro={reciboConstNames.carbs} screenSize={screenSize} infoLista={[reciboConstNames.fibra, reciboConstNames.complejos, reciboConstNames.simples]}></MacroNutrCardEdit>}></CustomCard>}


        {screenSize != "" && <CustomCard hijo={ 
        <FiberCard edit={false} totalFiber={recibo.fibra} screenSize={screenSize}></FiberCard>}></CustomCard>}

        </Flex>}

        {screenSize == "" && <PurpleSpinner></PurpleSpinner>}
    </>);

}
