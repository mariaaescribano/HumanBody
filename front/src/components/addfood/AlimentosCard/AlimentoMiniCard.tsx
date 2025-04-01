'use client'

import CustomCard from "@/components/global/cards/CustomCard"
import {
    Text, Box, Flex,
    HStack,VStack,
    Tooltip
  } from '@chakra-ui/react';
import { API_URL, CarbIcono, colorFibra, FiberIcono, getTamanyoPantalla, ProteIcono } from "../../../GlobalHelper";
import { useEffect, useRef, useState } from "react";
import { FatIcono } from "@/components/icons/FatIcon";
import axios from "axios";


export default function AlimentoMiniCard(props: 
  {idAlimento:number, nutri:boolean, 
  favDeUser?:boolean, editando?:boolean, nameAlimento:string, userNom:string, 
  predomina:number, calorias:string, getMacroNutrientsFoods?:any}) 
{

  const [screenSize, setscreenSize] = useState<string>(""); 
  const [hoverColor, sethoverColor] = useState<string>(""); 
  const [add, setadd] = useState<boolean | undefined>(undefined);
  const icono = useRef<any>(null);


  useEffect(() => 
  {
    getTamanyoPantalla(setscreenSize);
  }, [])

  useEffect(() => 
  {
    if(props.favDeUser && (props.favDeUser == true || props.favDeUser == false))
      setadd(props.favDeUser)
  }, [props.favDeUser])

  useEffect(() => 
  {
    if(props.predomina==0)
    {
      sethoverColor("#610C04");
      icono.current = <ProteIcono></ProteIcono>
    }
    else if(props.predomina==1)
      {
        sethoverColor("#abdefa");
        icono.current = <FatIcono></FatIcono>
      }
      else if(props.predomina==2)
        {
          sethoverColor("#EDC9AF");
          icono.current = <CarbIcono></CarbIcono>
        }
        else if(props.predomina==3)
          {
            sethoverColor(colorFibra);
            icono.current = <FiberIcono></FiberIcono>
          }
   
  }, [props.predomina]);

  const borrarAlimento = async () =>
  {
    if(props.userNom && props.idAlimento)
    {
      try{
      const response = await axios.delete(
          `${API_URL}/alimentos/deleteAlimento/${props.idAlimento}/${props.userNom}`,
          {
            headers: {
                'Content-Type': 'application/json'
            },
          }
      );

      if(response.data == true) // es q se ha eliminado
      {
        props.getMacroNutrientsFoods() // esta es la funcion q vuelve a cargar los alimentos list
      }
      }
      catch (error) {
      console.error('Error fetching data:', error);
      }
    }
  };


  const marcarComoFav = async (anyado:boolean) =>
  {
    if(props.idAlimento)
    {
      try
      {
        const response = await axios.put(
          `${API_URL}/fichas/updateAlimFav/${props.userNom}/${props.idAlimento}/${anyado}`,
          {
            headers: {
                'Content-Type': 'application/json'
            },
          }
        );
        if(response.data.message == "ok") // es q se ha eliminado
        {
          setadd(!add)
        }
      }
      catch (error) {
      console.error('Error fetching data:', error);
      }
    }
  };

  // lo devuelve solo si esta cragado 100%
  return  (
    <>
      {hoverColor !== "" && (
      <Flex
        zIndex={5}
        justifyContent="flex-start"
        alignItems="center"
        bg={hoverColor}
        p="5px"
        mt="10px"
        // borderBottom="1px solid"  // Aplica el borde solo en la parte inferior
        // borderColor={hoverColor}
        direction="row"
        borderRadius="20px"
        width="100%"
        // border="2px solid"
        // borderColor={hoverColor}  // Aplica el color dinámicamente
        mx="auto"
      >
    
        {/* Contenedor de ícono y texto */}
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <HStack spacing="10px" ml="5%">
            <Box
                bg="white" 
                boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)" 
                p="5px"                       
                borderRadius="80px"
                mr="5px"            
              >          
              {icono.current}
              </Box>
          
            <Box>
              <Text color={props.predomina== 0 ? "white":"black"} fontSize="md" fontWeight="700" textAlign="left">
                {props.nameAlimento}
              </Text>
              <Text color="gray.500" fontSize="10px" textAlign="left">
                {props.calorias} kcal / 100gr
              </Text>
            </Box>
          </HStack>


          {props.nutri == false && 
          <HStack>
          {/* basura */}
          {props.editando && props.editando==true && <Box onClick={borrarAlimento} ml="auto" display="flex" alignItems="center" cursor="pointer" mr="20px" >
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill={props.predomina==0 ?"#FFFFFF":"black" }><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
          </Box>}

          {(add == false || add == undefined) && <svg onClick={()=>  marcarComoFav(true)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={props.predomina==0 ?"#FFFFFF":"black" }><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>}
          {add == true && <svg onClick={()=>  marcarComoFav(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={props.predomina==0 ?"#FFFFFF":"black" }><path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/></svg>}
          
          {/* add */}
          <Box onClick={()=> location.href =`./verAlimento?idAlimento=${props.idAlimento}`} ml="auto" display="flex" alignItems="center" cursor="pointer" mr="20px" >
            <svg  xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill={props.predomina==0 ?"#FFFFFF":"black" }>
              <path d="M438.09-278.09h83.82v-160h160v-83.82h-160v-160h-83.82v160h-160v83.82h160v160ZM480-71.87q-84.91 0-159.34-32.12-74.44-32.12-129.5-87.17-55.05-55.06-87.17-129.5Q71.87-395.09 71.87-480t32.12-159.34q32.12-74.44 87.17-129.5 55.06-55.05 129.5-87.17 74.43-32.12 159.34-32.12t159.34 32.12q74.44 32.12 129.5 87.17 55.05 55.06 87.17 129.5 32.12 74.43 32.12 159.34t-32.12 159.34q-32.12 74.44-87.17 129.5-55.06 55.05-129.5 87.17Q564.91-71.87 480-71.87Zm0-91q133.04 0 225.09-92.04 92.04-92.05 92.04-225.09 0-133.04-92.04-225.09-92.05-92.04-225.09-92.04-133.04 0-225.09 92.04-92.04 92.05-92.04 225.09 0 133.04 92.04 225.09 92.05 92.04 225.09 92.04ZM480-480Z"/>
            </svg>
          </Box>
        </HStack>}

        {props.nutri == true && 
          <HStack>
          {/* recomend */}
          {<Tooltip label="Recommend to a client">
              <Box onClick={()=> location.href =`./verAlimento?idAlimento=${props.idAlimento}`} ml="auto" display="flex" alignItems="center" cursor="pointer" mr="20px" >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={props.predomina == 0 ? "#FFFFFF" : "black"}><path d="M480-440 160-640v400h360v80H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v280h-80v-200L480-440Zm0-80 320-200H160l320 200ZM760-40l-56-56 63-64H600v-80h167l-64-64 57-56 160 160L760-40ZM160-640v440-240 3-283 80Z"/></svg>
              </Box>
            </Tooltip >}
        </HStack>}

        </Box>
      </Flex>
      )}
    </>
  );

}
