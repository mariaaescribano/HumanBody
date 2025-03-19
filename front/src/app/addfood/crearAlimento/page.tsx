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
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
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
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import CustomCard from '@/components/global/cards/CustomCard';
import { API_URL, calcularPorcentajes, crearRecibo, esSoloNumeros, getTamanyoPantalla, redirigirSiNoHayUserNom, StringIsNull } from '../../../GlobalHelper';
import { alimentosSkeleton, miniCartaAlimento } from '../../../../../backend/src/dto/alimentos.dto';

import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';

import MacroNutrCardEdit from '@/components/addfood/crearAlimento/MacroNutrCardEdit';
import { MdCheck } from 'react-icons/md';
import { reciboSkeleton, reciboConstNames } from '../../../../../backend/src/dto/recibos.dto';
import SuccessErrorMessage from '@/components/global/message/SuccessErrorMessage';
import InputField from '@/components/global/random/InputField';
import { PieChardMacroNutr } from '@/components/global/cards/PieChardMacroNutr';
import FiberCard from '@/components/global/cards/FiberCard';
import { useRouter } from 'next/navigation';
import BarraMenu from '@/components/global/BarraMenu';
import TitleCard from '@/components/global/cards/TitleCard';
import { CaloryIcon } from '@/components/icons/CaloryIcon';

export default function CrearAlimento() 
{
  const [screenSize, setscreenSize ] = useState<string>("");
  const [nombre, setnombre ] = useState<string>("");
  const [calories, setcalories ] = useState<string>("");
  const [btnfinishedPulsado, setbtnfinishedPulsado ] = useState<boolean>(false);
  const [datosFaltan, setdatosFaltan ] = useState<{nombre:boolean; calories:boolean;}>({nombre:false, calories:false});
  const [mensajeError, setmensajeError ] = useState<boolean| undefined>(undefined);
  const [pieChardData, setpieChardData ] = useState<number[]>([20, 40, 30, 10]);
  const [recibo, setrecibo ] = useState< reciboSkeleton >(
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


  useEffect(() => 
  {
    redirigirSiNoHayUserNom();
    getTamanyoPantalla(setscreenSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // cada vez q el recibo cambia, se actualizan los valores del piechardData (array de numbers para porcentajes)
  useEffect(() => 
  {
    // compruebo si screensize tiene valor para q no se cargue esto antes de tiempo
    // si se cargase, el pieChard seria 0,0,0,0 y no queremos eso
    if(screenSize!="")
      {
        // let porcentajes = [20, 40, 30, 10]
        // if((parseInt(recibo.prote)==0 ||recibo.prote=="") && 
        // (parseInt(recibo.grasas)==0 ||recibo.grasas=="") &&
        // (parseInt(recibo.carbs)==0 ||recibo.carbs=="")&&
        // (parseInt(recibo.fibra)==0 ||recibo.fibra=="") )
        // {
          
        // }
        // else
        // {
        //   let lista = [parseInt(recibo.prote == "" ? "0" : recibo.prote, 10), 
        //     parseInt(recibo.grasas == "" ? "0" : recibo.grasas, 10), 
        //     parseInt(recibo.carbs == "" ? "0" : recibo.carbs, 10), 
        //     parseInt(recibo.fibra == "" ? "0" : recibo.fibra, 10)]
        //   porcentajes = calcularPorcentajes(lista)
        // }

        // setpieChardData(porcentajes)

        // chatgpt correccion
        let porcentajes = [20, 40, 30, 10];

        // Verifica si todos los valores de los nutrientes son nulos o 0.
        const valoresNutrientes = [recibo.prote, recibo.grasas, recibo.carbs, recibo.fibra];
        const lista = valoresNutrientes.map(value => parseInt(value || "0", 10));

        // Si hay algún valor distinto de 0 o vacío, calcula los porcentajes.
        if (lista.some(value => value > 0)) {
          porcentajes = calcularPorcentajes(lista);
        }

        setpieChardData(porcentajes);

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

    if(!reciboVacio && nombre!= "" && calories!="")
    {
      setbtnfinishedPulsado(true);
    }  
    else
    {
      setdatosFaltan((prev:any) => ({
        nombre: prev.nombre || StringIsNull(nombre),
        calories: prev.calories || StringIsNull(calories)
      }));
      setmensajeError(true);
    }  
  };

  useEffect(() => 
  {
    const doit = async () => 
    {
      let idRecibo = await crearRecibo(recibo);
      await crearAlimento(idRecibo);
      setbtnfinishedPulsado(false);
    };

    if(btnfinishedPulsado == true)
    {
      doit();
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btnfinishedPulsado]);


  const quePredomina = () =>
  {
    let predomina = 0;
    // console.log(pieChardData)
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
      nombre: nombre,
      calorias_100gr: calories,
      gramos: "100",
      recibo_id:idRecibo,
      predomina:predomina // 0-prote, 1-fats, 2-carbs
    }
    let nom = sessionStorage.getItem("userNom")
   
    try{
      const response = await axios.post(
          `${API_URL}/alimentos/createAlimento/${nom}`,
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
          const timer = setTimeout(() => {
            setbtnfinishedPulsado(false);
            location.href = "./buscarAlimento";
          }, 3000);
          return () => clearTimeout(timer); 
        }
      }
      catch (error) 
      {
        console.error('Error fetching data:', error);
      }
  };

  ///////// END CREAR ALIMENTO ////////////


  const cambiaCalories = (e:any) =>
  {
    let valor = e.target.value;
    if(valor == "")
    {
      setcalories(valor)
      eliminaRojo(false);
    }
    else if (esSoloNumeros(e.target.value))
    {
      setcalories(valor)
      eliminaRojo(false);
    }
  };

  const escribeNombre = (value:any) =>
  {
    eliminaRojo(true);
    setnombre(value) 
  };

  const eliminaRojo = (soyNombre:boolean) =>
  {
    if(soyNombre==true && datosFaltan.nombre==true)
    {
      setdatosFaltan((prev:any) => ({
        nombre: false,
        calories: prev.calories
      }));
    }
    if(soyNombre==false && datosFaltan.calories==true)
    {
      setdatosFaltan((prev:any) => ({
        nombre: prev.nombre,
        calories: false
      }));
    }
    if(mensajeError)
      setmensajeError(undefined)
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

      <BarraMenu></BarraMenu>

      {mensajeError == true &&<PopUpErrorMessage title={'Error'} texto={'Please, fill up all the data'}></PopUpErrorMessage>}
     
      <CustomCard mt={mensajeError==true ? "20px" : "0px"} hijo={ 
        <TitleCard title={'CREATE A FOOD'} 
          firstBtnText={'X CANCEL'} firstBtnIcon={''} btnDisabled={btnfinishedPulsado} 
          secondBtnText={'SAVE'} secondBtnIcon={<Icon boxSize={"20px"} as={MdCheck}/>} 
          letsgo={finish} goback={() => location.href = "./buscarAlimento"} 
          mensajeError={mensajeError == false ? true: undefined} textMensajeError={mensajeError == false ? "Food created": ""} statusMensajeError={mensajeError == false ? "success": ""}
          titleIcon={
          <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
              style={{ verticalAlign: 'middle' }} // Asegura que el SVG se alinee con el texto
          >
              <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
          </svg>}/>}>
      </CustomCard>

      <CustomCard mt="10px" hijo={ 
          <>
          <Box mb={{ base: '20px', md: '20px' }}>
        {/* SimpleGrid ajusta las columnas según el tamaño de la pantalla */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
          <VStack >
              <InputField
              mb="20px"
              onChange= {(e:any) => escribeNombre(e.target.value)}
              id="first"
              bg={datosFaltan.nombre == true ? "red.200" : ""}
              placeholder="Apple"
              label="Food Name"
              textAlign={"center"}
              />

              <HStack ml="30px">
                <Flex direction='column' >
                  <HStack>
                      <Box mt="-10px">
                        <CaloryIcon></CaloryIcon>
                      </Box>
                      <FormLabel
                        display='flex'
                        ms='10px'
                        ml="-5px"
                        fontSize='sm'
                        color={"black"}
                        fontWeight='bold'
                        _hover={{ cursor: 'pointer' }}>
                        Calories per 100 grams
                      </FormLabel>
                  </HStack>
                  <Input
                    onChange={(e: any) => cambiaCalories(e)}
                    id="second"
                    bg={datosFaltan.calories == true ? "red.200" : ""}
                    value={calories}
                    placeholder="57"
                    textAlign={"center"}
                    border="1px solid gray"
                    borderRadius="10px"
                    fontWeight="500"
                    variant="main"
                    _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
                    h="44px"
                    maxH="44px"
                  />
                </Flex>
                <Text mt="30px">kcal</Text>
              </HStack>         
          </VStack>

          <Box w={{ base: '200px', md: '100%' }} ml={{ base: "30px", md: "0px" }} mt={{ base: "10px", md: "0px" }}>
            <PieChardMacroNutr pieChartData={pieChardData} />
          </Box>
        </SimpleGrid>

        {/* Centrar el componente CircProgressMacroEdit */}
      
      </Box>

      </>}></CustomCard>

      {screenSize != "" && <CustomCard mt="10px" hijo={ 
      <MacroNutrCardEdit recibo={recibo} setrecibo={setrecibo} 
      totalMacro={reciboConstNames.prote} 
      screenSize={screenSize} 
      infoLista={[reciboConstNames.completo, reciboConstNames.incompleto]}>
      </MacroNutrCardEdit>}></CustomCard>}
      
      {screenSize != "" && <CustomCard mt="10px" hijo={ 
        <MacroNutrCardEdit recibo={recibo} setrecibo={setrecibo} 
        totalMacro={reciboConstNames.grasas} screenSize={screenSize} 
        infoLista={[reciboConstNames.monoinsaturadas,reciboConstNames.poliinsaturadas, reciboConstNames.saturadas]}>
        </MacroNutrCardEdit>}></CustomCard>}

      {screenSize != "" &&  <CustomCard mt="10px" hijo={  
      <MacroNutrCardEdit recibo={recibo} setrecibo={setrecibo} 
      totalMacro={reciboConstNames.carbs} screenSize={screenSize} infoLista={[reciboConstNames.complejos, reciboConstNames.simples]}>
      </MacroNutrCardEdit>}></CustomCard>}

      {screenSize != "" && <CustomCard mt="10px" hijo={ 
      <FiberCard edit={true} recibo={recibo}  setrecibo={setrecibo} totalFiber={recibo.fibra} screenSize={screenSize}></FiberCard>}></CustomCard>}


      </Flex>}

      {screenSize == "" && <PurpleSpinner></PurpleSpinner>}
    </>);

}
