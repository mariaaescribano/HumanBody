'use client'

import CustomCard from "@/components/global/CustomCard"
import {
    Text, Box, Flex,
    HStack,VStack
  } from '@chakra-ui/react';
import { CarbIcono, FatIcono, getTamanyoPantalla, ProteIcono } from "../../../../GlobalHelper";
import { useEffect, useRef, useState } from "react";


export default function AlimentoMiniCard(props: {nameAlimento:string, predomina:number, calorias:string}) {

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
      bg="white"
      p="5px"
      mt="10px"
      direction={"row"}  // Asegura que el contenido se disponga en línea horizontal
      borderRadius="20px"
      cursor="pointer"
      _hover={{ bg: hoverColor }}
      width="100%"
      mx="auto"
    >
      {/* Contenedor de ícono y texto */}
      <HStack spacing="10px" width="100%" ml="5%">
        
        {/* Ícono con ancho fijo */}
        <Box width="40px" minWidth="40px" display="flex" justifyContent="center">
          {icono.current}
        </Box>

        {/* Contenedor de texto */}
        <Box>
          <Text
            color="black"
            fontSize="md"
            fontWeight="700"
            textAlign="left"
          >
            {props.nameAlimento}
          </Text>
          <Text color="gray.500" fontSize="10px" textAlign="left">
            {props.calorias} kcal / 100gr
          </Text>
        </Box>
      </HStack>
    </Flex>
  )}
</>

  
  );
}
