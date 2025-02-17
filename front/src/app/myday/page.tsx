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
import PopUpMessage from '@/components/global/PopUpMessage';
import PopUpErrorMessage from '@/components/global/PopUpErrorMessage';
import PurpleSpinner from '@/components/global/Spinner';
import CustomCard from '@/components/global/CustomCard';
import { getInternetDateParts } from '../../../GlobalHelper';
import { CircProgressMini } from '@/components/myday/CircProgressMini';
import MacroCalView from '@/components/myday/MacroCalView';
import ElementoPrimero from '@/components/myday/ElementoPrimero';
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import MacroNutrCard from '@/components/signin/MacroNutrCard';

export default function MyDay() 
{
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const [peso, setPeso] = useState<string>("");
  const [altura, setAltura] = useState<string>("");
  const [exerciseFrequency, setexerciseFrequency] = useState<string>("");
  const [objetivo, setObjetivo] = useState<string>("");
  const [nom, setnom] = useState<string>("");
  const [contra, setcontra] = useState<string>("");
  const [genero, setgenero] = useState<string>("");
  const [edad, setedad] = useState<string>("");

  const [filled, setfilled] = useState<boolean>(true);
  const [nomExiste, setnomExiste] = useState<boolean>(false);
  const [datosAntes, setDatosAntes] = useState<boolean | undefined>(undefined);

//   useEffect(() => 
//   {
//     const userStr = sessionStorage.getItem("user");
//     if (userStr) 
//     {
//       const user = JSON.parse(userStr); 
//       if(user)
//       {
//         setPeso(user.peso)
//         setAltura(user.altura)
//         setexerciseFrequency(user.exerciseFrequency)
//         setObjetivo(user.objetivo)
//         setnom(user.nombre)
//         setcontra(user.contra)
//         setedad(user.edad)

//         setDatosAntes(true);
//       }
//       else
//       {
//         setDatosAntes(false);
//       }
//     }
//     else
//     {
//       setDatosAntes(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const comprobarSiPoderPaso2 = () =>
//   {
//     if(!StringIsNull(peso)
//     && !StringIsNull(altura)
//     && !StringIsNull(exerciseFrequency)
//     && !StringIsNull(objetivo)
//     && !StringIsNull(nom)
//     && !StringIsNull(contra)
//     && !StringIsNull(genero) && nomExiste== false)
//     {
//         // quitar comillas
//         let pesoSinComillas = peso.replace(/^"|"$/g, '');
//         let alturaSinComillas = altura.replace(/^"|"$/g, '');
//         let edadSinComillas = edad.replace(/^"|"$/g, '');
//         let generoSinComillas = genero.replace(/^"|"$/g, '');
//         let nombreSinComillas = nom.replace(/^"|"$/g, '');
//         let contraSinComillas = contra.replace(/^"|"$/g, '');

//        const user:createUserSkeleton = {
//         nombre:nombreSinComillas,
//         contra:contraSinComillas,
//         peso:pesoSinComillas,
//         altura:alturaSinComillas,
//         nivel_actividad:exerciseFrequency,
//         calorias_objetivo:"",
//         objetivo:objetivo,
//         recibo: NaN,
//         genero: generoSinComillas,
//         edad:edadSinComillas
//       };

//       sessionStorage.clear();
//       sessionStorage.setItem("user", JSON.stringify(user));

//       location.href = "./parte2";

//     }
//     else
//     {
//       setfilled(false);
//     }
//   };

//   const writingName = (e:any) =>
//   {
//     let nom =e.target.value;
//     setnom(nom)
//     if(nom!= "")
//       existeName(nom);
//   };

//   const existeName = async (nombre:string) =>
//   {
//     try{
//     const response = await axios.get(
//       `${API_URL}/usuarios/userExist/${nombre}`,
//       {
//         headers: {
//             'Content-Type': 'application/json'
//         },
//       }
//     );
//       if(response.data != null)
//       {
//         setnomExiste(response.data.exists);
//       }
//     }
//     catch (error) {
//     console.error('Error fetching data:', error);
//     }
//   } 
const alignSelfValue = useBreakpointValue({ base: "center", md: "flex-start" });



  return (
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
       <CustomCard hijo={<ElementoPrimero></ElementoPrimero>}></CustomCard>

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
       

      {datosAntes == undefined && <PurpleSpinner></PurpleSpinner>}

    </Flex>);

}
