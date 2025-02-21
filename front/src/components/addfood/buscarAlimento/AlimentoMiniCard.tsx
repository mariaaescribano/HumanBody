'use client'

import CustomCard from "@/components/global/cards/CustomCard"
import {
    Text, Box, Flex,
    HStack,VStack
  } from '@chakra-ui/react';
import { CarbIcono, getTamanyoPantalla, ProteIcono } from "../../../../GlobalHelper";
import { useEffect, useRef, useState } from "react";
import { FatIcono } from "@/components/global/random/FatIcon";


export default function AlimentoMiniCard(props: {idAlimento:number, nameAlimento:string, predomina:number, calorias:string}) {

  const [screenSize, setscreenSize] = useState<string>(""); 
  const [hoverColor, sethoverColor] = useState<string>(""); 
  const icono = useRef<any>(null);

  useEffect(() => 
  {
    getTamanyoPantalla(setscreenSize);
  }, [])

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
   
  }, [props.predomina]);

  return (
    <>
  {hoverColor !== "" && (
    <Flex
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

        <Box as="a" href={ `./verAlimento?idAlimento=${props.idAlimento}`} ml="auto" display="flex" alignItems="center" cursor="pointer" mr="20px" >
          <svg  xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill={"white"}>
            <path d="M438.09-278.09h83.82v-160h160v-83.82h-160v-160h-83.82v160h-160v83.82h160v160ZM480-71.87q-84.91 0-159.34-32.12-74.44-32.12-129.5-87.17-55.05-55.06-87.17-129.5Q71.87-395.09 71.87-480t32.12-159.34q32.12-74.44 87.17-129.5 55.06-55.05 129.5-87.17 74.43-32.12 159.34-32.12t159.34 32.12q74.44 32.12 129.5 87.17 55.05 55.06 87.17 129.5 32.12 74.43 32.12 159.34t-32.12 159.34q-32.12 74.44-87.17 129.5-55.06 55.05-129.5 87.17Q564.91-71.87 480-71.87Zm0-91q133.04 0 225.09-92.04 92.04-92.05 92.04-225.09 0-133.04-92.04-225.09-92.05-92.04-225.09-92.04-133.04 0-225.09 92.04-92.04 92.05-92.04 225.09 0 133.04 92.04 225.09 92.05 92.04 225.09 92.04ZM480-480Z"/>
          </svg>
        </Box>
      </Box>
    </Flex>
  )}
</>

  
  );
}
