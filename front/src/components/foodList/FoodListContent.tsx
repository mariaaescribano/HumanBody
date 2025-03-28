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
import { API_URL, calcularPorcentajes, colorNutricionist, crearRecibo, esSoloNumeros, getTamanyoPantalla, redirigirSiNoHayNutriNom, redirigirSiNoHayUserNom, StringIsNull } from '../../GlobalHelper';
import SuccessErrorMessage from '@/components/global/message/SuccessErrorMessage';
import InputField from '@/components/global/random/InputField';
import { PieChardMacroNutr } from '@/components/global/cards/PieChardMacroNutr';
import FiberCard from '@/components/global/cards/FiberCard';
import { useRouter } from 'next/navigation';
import BarraMenu from '@/components/global/BarraMenu';
import TitleCard from '@/components/global/cards/TitleCard';
import { CaloryIcon } from '@/components/icons/CaloryIcon';
import AlimentoMiniCard from '@/components/addfood/AlimentosCard/AlimentoMiniCard';
import { alimentosComidosSkeleton } from '../../../../backend/src/dto/alimentos.dto';
import AlimentoMiniJustRead from '@/components/addfood/AlimentosCard/AlimentoMiniJustRead';
import GreenSpinner from '@/components/global/random/GreenSpinner';
import BarraMenuNutri from '@/components/nutritionist/BarraMenuNutri';

export default function FoodListContent(props:{alimentos:alimentosComidosSkeleton[], setalimentos:any}) 
{
    const [nutri, setnutri ] = useState<boolean>();

    useEffect(() => 
    {
        const queryParams = new URLSearchParams(location.search);
        const soyNutri = queryParams.get('soyNutri');
        if(soyNutri)
        {
            setnutri(true)
            redirigirSiNoHayNutriNom();
        }
        else
        {
            setnutri(false)
            redirigirSiNoHayUserNom(); 
        }
        
        const diaId = queryParams.get('diaId') || sessionStorage.getItem("diaId");
        
        if(diaId)
            dameAlimentosComidosHoy(diaId)
        else
            location.href = "../myday"
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dameAlimentosComidosHoy = async (diaId:string) =>
        {
        // coge el id dia de hoy
        try {
            const response = await axios.get(
                `${API_URL}/dias/diaAlimentos/${diaId}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data) {
                props.setalimentos(response.data)
            }
        } catch (error:any) 
        {
            if(error.status == 404)
            {
                props.setalimentos([]) // its filled with [] to tell down that is not undefined
            }
            console.log('Error al coger alimentos de hoy:', error);
        }
        // devuelve alimentos
        // los muestra
        };
  
  return (
    <>
      { props.alimentos && 
      <Flex
        direction="column"
        align="center"
        bg= {nutri== false ? "purple.100" : colorNutricionist} 
        w="100%"
        h="100%"
        justify="center"
        p="20px"
        minH="100vh"
        position={"relative"}
      >

      {nutri==false &&<BarraMenu></BarraMenu>}
      {nutri==true &&<BarraMenuNutri></BarraMenuNutri>}

      <CustomCard mt={"0px"} p="20px" hijo={ 
        <Text fontSize="2xl" fontWeight={"bold"}>FOOD LIST</Text>
        } >
      </CustomCard>

      <CustomCard mt="10px" p={props.alimentos?.length == 0 ? "20px" : "30px"} hijo={ 
        <>

          { props.alimentos && props.alimentos?.length > 0 &&
          props.alimentos.map((alimento, index) => (
            <AlimentoMiniJustRead key={index} alimentoComido={alimento[0]}></AlimentoMiniJustRead>
          ))}

          {props.alimentos && props.alimentos?.length == 0 &&
            <Text color="red">There is no food registered for today</Text>}

        </>}>
      </CustomCard>
      </Flex>}
    </>);

}
