'use client';
import { Flex, Box, Icon, Text, HStack, Image, VStack, Input, SimpleGrid, FormLabel, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { API_URL, borrarAlimentoComidoDeBD, CarbIcono, colorFibra, dameDatosDeAlimentoConcreto, dameReciboDeAlimentoConcreto, FiberIcono, ProteIcono, reglasDeTresParaAlimentoGramosPersonalizados, restaDeMacros, updateCaloriesDiasComidos, updateRecibo } from '@/GlobalHelper';
import { alimentosComidosSkeleton } from '../../../../../backend/src/dto/alimentos.dto';
import { FatIcono } from '@/components/icons/FatIcon';
import axios from 'axios';


export default function AlimentoMiniJustRead(props: { alimentoComido: alimentosComidosSkeleton, 
  nutri:boolean, seterror:any, dameAlimentosComidosHoy:any }) 
{
  const icono = useRef<any>(null);
  const [hoverColor, sethoverColor] = useState<string>(""); 
  const calories = useRef<string>("");
  
  useEffect(() => 
  {
      if(props.alimentoComido.predomina==0)
      {
          sethoverColor("#610C04");
          icono.current = <ProteIcono></ProteIcono>
      }
      else if(props.alimentoComido.predomina==1)
      {
      sethoverColor("#abdefa");
      icono.current = <FatIcono></FatIcono>
      }
      else if(props.alimentoComido.predomina==2)
      {
          sethoverColor("#EDC9AF");
          icono.current = <CarbIcono></CarbIcono>
      }
      else if(props.alimentoComido.predomina==3)
          {
          sethoverColor(colorFibra);
          icono.current = <FiberIcono></FiberIcono>
          }
  
  }, [props.alimentoComido]);


  const borrarAlimentoComido = async () =>
  {
    try 
    {
      // STRATEGY
      // take the id and make the regladetres
      let alimentoConcreto = await dameDatosDeAlimentoConcreto(props.alimentoComido.idAlimento);
      // get the receipt of the alimento original
      let reciboOriginal = await dameReciboDeAlimentoConcreto(alimentoConcreto.recibo_id)
      // lets get reciboDiaUser to sum the new foods
      let reciboDiaUser = await dameReciboDeAlimentoConcreto(Number(sessionStorage.getItem("reciboDeHoy")))
      // personalice the receipt following the number of grams user selected
      let nuevoReciboPersonalizado= reglasDeTresParaAlimentoGramosPersonalizados(reciboOriginal, calories, props.alimentoComido.gramosTotales, alimentoConcreto)
      // get calories, get the receipt and rest it from today
      let reciboDiaAfterRest = restaDeMacros(nuevoReciboPersonalizado, reciboDiaUser)
      let caloriesTotalAfterRest = Number(sessionStorage.getItem("caloriasDeHoy")) - Number(calories.current);
      sessionStorage.setItem("caloriasDeHoy", caloriesTotalAfterRest.toString())
      // save the new receipt and calories
      await updateRecibo(reciboDiaAfterRest, sessionStorage.getItem("reciboDeHoy"), null)
      await updateCaloriesDiasComidos(caloriesTotalAfterRest.toString(), props.alimentoComido.id, sessionStorage.getItem("diaId"))
      // delete id comido from bd 
      await borrarAlimentoComidoDeBD(props.alimentoComido.id)

      // recharge the page
      props.dameAlimentosComidosHoy(sessionStorage.getItem("diaId"))
    } 
    catch (error) 
    {
      props.seterror("Failed to remove food. Please try again later")
      console.log("Error al actualizar la base de datos:", error);
    }
  };

  return (
      <Flex
      zIndex={5}
      justifyContent="flex-start"
      alignItems="center"
      bg={hoverColor}
      p="8px"
      mt="10px"
      direction="row"
      borderRadius="20px"
      width="100%"
      mx="auto"
    >
  
      {/* Contenedor de ícono y texto */}
      <Box display="flex" justifyContent="space-between" p="2px" alignItems="center" width="100%">
          <Box
              bg="white" 
              boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)" 
              p="5px"                       
              borderRadius="80px"
              ml="10px"
              mr="10px"            
            >          
            {icono.current}
          </Box>

          <Flex direction="row" justify="space-between" w="100%">
            <Text color={props.alimentoComido.predomina == 0 ? "white" : "black"} fontSize="md" fontWeight="700" >
              {props.alimentoComido.nom}
            </Text>
            <HStack spacing="10px" mr="5px">
              <Text mr="10px" color={props.alimentoComido.predomina == 0 ? "white" : "black"} fontSize="md" >
                {props.alimentoComido.calorias} kcal / {props.alimentoComido.gramosTotales} gr
              </Text>
              {props.nutri == false && <svg cursor="pointer" onClick={borrarAlimentoComido} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={props.alimentoComido.predomina == 0 ? "white" : "black"}><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>}
            </HStack>
          </Flex>
      </Box>
    </Flex>
  );
}
