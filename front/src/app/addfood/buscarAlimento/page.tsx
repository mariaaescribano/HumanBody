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
import { API_URL, getInternetDateParts } from '../../../../GlobalHelper';
import { CircProgressMini } from '@/components/myday/CircProgressMini';
import MacroCalView from '@/components/myday/MacroCalView';
import ElementoPrimero from '@/components/myday/ElementoPrimero';
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import Buscador from '@/components/addfood/buscarAlimento/Buscador';
import Barra from '@/components/addfood/buscarAlimento/Barra';
import AlimentoMiniCard from '@/components/addfood/buscarAlimento/AlimentoMiniCard';
import { miniCartaAlimento } from '../../../../../backend/src/dto/alimentos.dto';

export default function BuscarAlimento() 
{
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  // mostrar alimentos con predominancia de un macronutriente
  const [quienPulsado, setquienPulsado] = useState<number>(0); 

  const [alimentosLista, setalimentosLista] = useState<miniCartaAlimento[]>([]);

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
    const getMacroNutrientsFoods = async () =>
    {
      try
      {
        const response = await axios.get(
          `${API_URL}/alimentos/macroPredomina/${quienPulsado}`,
          {
            headers: {
                'Content-Type': 'application/json'
            },
          }
        );
        if(response.data.foods != null)
        {
          const recoge = [];
          for(let i=0; i< response.data.foods.length; i++)
          {
            let objeto: miniCartaAlimento = 
            {
              nombre: response.data.foods[i].nombre,
              predomina:response.data.foods[i].predomina,
              calorias_100gr: response.data.foods[i].calorias_100gr
            }
            recoge.push(objeto)
          }
          setalimentosLista(recoge)
        }
      }
      catch (error) {
      console.error('Error fetching data:', error);
      }
    }  
   
    getMacroNutrientsFoods();
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
                    w={{sd:"70%", md: "70%"}}
                    mt="20px"
                    h="100%"
                    onClick={()=> location.href = "./crearAlimento"}
                    p="10px"
                    _hover={{bg:"gray.100"}}
                    leftIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z"/></svg>}
                    > CREATE A FOOD
                    </Button>

                  <Barra setquienPulsado={setquienPulsado} quienPulsado={quienPulsado}></Barra>


                {/* hacer un div y ponerlos con un .map */}
                {alimentosLista.length >0 && alimentosLista.map((alimento, index) => (
                  <AlimentoMiniCard 
                    key={index}
                    nameAlimento={alimento.nombre} 
                    predomina={alimento.predomina} 
                    calorias={alimento.calorias_100gr} 
                  />
                ))} 

                <Box  justifyContent="center">
                {alimentosLista.length ==0 && <PurpleSpinner></PurpleSpinner>}
                </Box>
                 

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
      

    </Flex>);

}
