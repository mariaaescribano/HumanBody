'use client';
// Chakra imports
import {
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
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import SelectSignIn from '@/components/signin/SelectSignIn';
import PopUpMessage from '@/components/global/message/PopUpMessage';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import CustomCard from '@/components/global/cards/CustomCard';
import { API_URL, crearRecibo, dameDatosDelRecibo, formatDateToISOFriendly, getFecha, getInternetDateParts, getTamanyoPantalla, redirigirSiNoHayUserNom } from '../../GlobalHelper';
import ElementoPrimero from '@/components/myday/ElementoPrimero';
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import { macroPorcentajes, reciboSkeleton, showMacroNutrSignUp } from '../../../../backend/src/dto/recibos.dto';
import { fidelidadCompleteSkeleton, fidelidadSkeleton } from '../../../../backend/src/dto/fidelidad.dto';
import { showEbook } from '../../../../backend/src/dto/ebook.dto';
import FiberCard from '@/components/global/cards/FiberCard';
import FidelidadCard from '@/components/fidelity/FidelidadCard';
import BarraMenu from '@/components/global/BarraMenu';
import { useRouter } from 'next/navigation';
import TitleCard from '@/components/global/cards/TitleCard';
import { HeartIcon } from '@/components/icons/HeartIcon';
import { MdCheck } from 'react-icons/md';
import InputField from '@/components/global/random/InputField';
import FidelityToMyselfContent from '@/components/fidelity/FidelityToMyselfContent';



export default function Fidelity() 
{
  const [btnPulsado, setbtnPulsado ] = useState<boolean>(false);
  const [mensajeError, setmensajeError ] = useState<boolean | undefined>(undefined);
  // const mensajeStatus = useRef<string>("success");

  // aqui guarda si ya hay datos
  const [datos, setdatos ] = useState< fidelidadCompleteSkeleton | null >(null);
  ///////////////////// END DECLARATIONS /////////////////////


  // 0: comprobar si ya existen datos de fidelitytomyself
  useEffect(() => 
  {
    redirigirSiNoHayUserNom();
    dameDatosFidelidadSiHay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dameDatosFidelidadSiHay = async () =>
  {
    let nom = sessionStorage.getItem("userNom")
   
    try{
      const response = await axios.get(
          `${API_URL}/fidelitytomyself/fidelityUser/${nom}`,
          {
            headers: {
                'Content-Type': 'application/json'
            },
          }
      );
      if(response.data != null)
      {
        let fidelidad = ponDatosVacios(response.data[0]);
        setdatos(fidelidad)
      }
    }
    catch (error) 
    {
      console.error('Error fetching data:', error);
    }
  };


  // en caso de q usuario NO haya rellenado todos los datos
  // los q se ha dejado vacios, los rellenamos
  const ponDatosVacios = (data:any) =>
  {
    let fidelity = {
      estoy: data?.estoy ?? "",
      estare: data?.estare ?? "",
      objetivo: data?.objetivo ?? "",
      acercarme: data?.acercarme ?? "",
      autosaboteo: data?.autosaboteo ?? "",
      trustmyself: data?.trustmyself ?? "",
      id: data?.id ?? ""
    };
    return fidelity;
  };




  // 1: se guardan
  const salvar = async () =>
  {
    let nom = sessionStorage.getItem("userNom")
    
    let datosCompletos = ponDatosVacios(datos);
    if (nom && datosCompletos) 
    {
      setbtnPulsado(true)
      try {
        const response = await axios.put(
            `${API_URL}/fidelitytomyself/updatefidelitytomyself/${nom}`,
            datosCompletos,
            {
              headers: {
                  'Content-Type': 'application/json'
              },
            }
        );
          if(response.data && response.data?.message === "ok")
          {
            setmensajeError(false)
          }
        }
        catch (error) 
        {
          setmensajeError(true)
          console.error('Error fetching data:', error);
        }
        finally
        {
          setbtnPulsado(false)
        }
    }
  };


  const escribir = (soy: string, value: string) => {
    setdatos(prev => ({
      ...prev,
      [soy]: value || ''  
    }));
  };

  useEffect(() => 
  {
    if(mensajeError!=undefined)
    {
      const timer = setTimeout(() => {
        setmensajeError(undefined)
      }, 3000);
      return () => clearTimeout(timer); 
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensajeError]);



  return (
    <>
    
    { datos!= null && 
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

        <BarraMenu rellena={"heart"}></BarraMenu>

        {mensajeError == true && <PopUpErrorMessage title={'Error'} texto={'Please, try again later.'}></PopUpErrorMessage>}

        <CustomCard mt={mensajeError == true ? "20px":"0px"} hijo={
            <TitleCard 
            title={'FIDELITY TO MYSELF'} titleIcon={<Box mt={{base: "10px", md : "-10px"}} mb="-20px"><Icon as={HeartIcon}/></Box>}
            firstBtnText={'X Cancel'} firstBtnIcon={""} letsgo={salvar} btnDisabled={btnPulsado} 
            secondBtnText={'Save'} secondBtnIcon={<Icon boxSize={"20px"} as={MdCheck} />} goback={()=> location.href = "../myday"} 
            mensajeError={mensajeError != undefined && mensajeError != true ? mensajeError : undefined} 
            textMensajeError={"Fidelity updated!"} statusMensajeError={'success'}       
            ></TitleCard>}>
        </CustomCard>
       
        <CustomCard mt="10px" hijo={
        <>
          <FidelityToMyselfContent escribir={escribir} datos={datos} ></FidelityToMyselfContent>
        </>
        }></CustomCard>

    </Flex>} 


      {datos == null && <PurpleSpinner></PurpleSpinner>} 
      </>
    );

}
