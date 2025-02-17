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
import { getInternetDateParts } from '../../../../GlobalHelper';
import { CircProgressMini } from '@/components/myday/CircProgressMini';
import MacroCalView from '@/components/myday/MacroCalView';
import ElementoPrimero from '@/components/myday/ElementoPrimero';
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import Buscador from '@/components/addfood/buscarAlimento/Buscador';
import Barra from '@/components/addfood/buscarAlimento/Barra';
import AlimentoMiniCard from '@/components/addfood/buscarAlimento/AlimentoMiniCard';

export default function BuscarAlimento() 
{
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [quienPulsado, setquienPulsado] = useState<number>(0);
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


  useEffect(() => 
  {
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quienPulsado]);


  return (
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
        {/* title */}
        <CustomCard hijo={
            <>
                <Buscador></Buscador>
                <Button
                    fontSize="sm"
                    borderRadius="16px"
                    bg="purple.100"
                    w="50%"
                    mt="20px"
                    h="100%"
                    p="10px"
                    _hover={{bg:"gray.100"}}
                    // rightIcon={<AddIcon />}
                    > CREATE A FOOD
                    </Button>

                  <Barra setquienPulsado={setquienPulsado} quienPulsado={quienPulsado}></Barra>


                {/* hacer un div y ponerlos con un .map */}
                  <AlimentoMiniCard nameAlimento={'Manzana'} predomina={''}></AlimentoMiniCard>
                  <AlimentoMiniCard nameAlimento={'Manzana'} predomina={''}></AlimentoMiniCard>
                  <AlimentoMiniCard nameAlimento={'Manzana'} predomina={''}></AlimentoMiniCard>
            </>}></CustomCard>
       {/* calorias y macronutrients overall view */}
       {/* <CustomCard hijo={<ElementoPrimero></ElementoPrimero>}></CustomCard>

       <CustomCard hijo={ <Button
               fontSize="sm"
               borderRadius="16px"
               bg="purple.100"
               w="100%"
               h="auto"
               p="10px"
               _hover={{bg:"gray.100"}}
               // onClick={comprobarSiPoderPaso2}
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
        </CustomCard> */}


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
