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
import InputField from '@/components/global/random/InputField';
import { PieChardMacroNutr } from '@/components/global/cards/PieChardMacroNutr';
import FiberCard from '@/components/global/cards/FiberCard';

export default function CrearAlimento() 
{
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [screenSize, setscreenSize ] = useState<string>("");
  const foodName = useRef<string>("");
  const [calories, setcalories ] = useState<string>("");
  const [btnfinishedPulsado, setbtnfinishedPulsado ] = useState<boolean>(false);
  const [mensajeError, setmensajeError ] = useState<boolean| undefined>(undefined);
  const [pieChardData, setpieChardData ] = useState<number[]>([20, 40, 30, 10]);
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


  useEffect(() => 
  {
    getTamanyoPantalla(setscreenSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // cada vez q el recibo cambia, se actualizan los valores del piechardData (array de numbers para porcentajes)
  useEffect(() => 
  {
    if(recibo.prote != "" && recibo.grasas!= "" && recibo.carbs!= "" && recibo.fibra!= "")
    {
      let lista = [parseInt(recibo.prote, 10), parseInt(recibo.grasas, 10), parseInt(recibo.carbs, 10), parseInt(recibo.fibra, 10)] 
      let porcentajes = calcularPorcentajes(lista)
      setpieChardData(porcentajes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recibo]);
 



  ///////// CREAR ALIMENTO ////////////

  const esReciboVacio = (): boolean => {
    return Object.values(recibo).every(value => value === "");
  };
  

  const finish = async () => 
  {
    let reciboVacio = esReciboVacio();

    if(!reciboVacio && foodName.current!= "" && calories!="")
    {
      setbtnfinishedPulsado(true);
      let idRecibo = await crearRecibo(recibo);
      await crearAlimento(idRecibo);
      setbtnfinishedPulsado(false);
    }  
    else
    {
      setmensajeError(true);
    }  
  };


  const quePredomina = () =>
  {
    let predomina = 0;
    if(pieChardData[0] > pieChardData[1] && pieChardData[0] > pieChardData[2])
    {
      predomina = 0;
    } 
    else if(pieChardData[1] > pieChardData[0] && pieChardData[1] > pieChardData[2])
      {
        predomina = 1;
      } 
      else if(pieChardData[2] > pieChardData[1] && pieChardData[2] > pieChardData[0])
        {
          predomina = 2;
        }  
        return predomina;
  }  



  const crearAlimento = async (idRecibo:number) => 
  {
    let predomina = quePredomina();
  
    const alimento: alimentosSkeleton= 
    {
      nombre: foodName.current,
      calorias_100gr: calories,
      gramos: "100",
      recibo_id:idRecibo,
      predomina:predomina // 0-prote, 1-fats, 2-carbs
    }
   
    try{
      const response = await axios.post(
          `${API_URL}/alimentos/createAlimento`,
          alimento,
          {
            headers: {
                'Content-Type': 'application/json'
            },
          }
      );
        if(response.data != null)
        {
          setmensajeError(false);
        }
      }
      catch (error) {
      console.error('Error fetching data:', error);
      }
  };

  ///////// END CREAR ALIMENTO ////////////


  useEffect(() => {
    if (mensajeError==false) {
      const timer = setTimeout(() => {
        location.href = "./buscarAlimento";
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [mensajeError]); 



  const cambiaCalories = (e:any) =>
  {
    if(esSoloNumeros(e.target.value)) 
    {
      setcalories(e.target.value)
    }    
  };


  return (
    <>
      {screenSize != "" && 
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

      {mensajeError == true &&<PopUpErrorMessage title={'Error'} texto={'Please, fill up all the data'}></PopUpErrorMessage>}
     
        
        <CustomCard hijo={ 
            <>
          <Flex justify="start" gap="5px" align="center" mb="10px">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                    style={{ verticalAlign: 'middle' }} // Asegura que el SVG se alinee con el texto
                >
                    <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
                </svg>

                <Text color={textColor} fontSize="2xl" fontWeight="700">
                    CREATE A FOOD
                </Text>
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
                X CANCEL
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
                  onClick={finish}
                  leftIcon={<Icon as={MdCheck} />}
                >
                  FINISHED
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
                    onChange= {(e:any) => { cambiaCalories(e)  }}
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

        {screenSize != "" &&  <CustomCard hijo={  <MacroNutrCardEdit recibo={recibo} setrecibo={setrecibo} totalMacro={reciboConstNames.carbs} screenSize={screenSize} infoLista={[reciboConstNames.complejos, reciboConstNames.simples]}></MacroNutrCardEdit>}></CustomCard>}

        {screenSize != "" && <CustomCard hijo={ 
       <FiberCard edit={true} totalFiber={""} screenSize={screenSize}></FiberCard>}></CustomCard>}


        </Flex>}

        {screenSize == "" && <PurpleSpinner></PurpleSpinner>}
    </>);

}
