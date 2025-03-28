'use client';
import { Flex, Box, Icon, Text, HStack, Image, VStack, Input, SimpleGrid, FormLabel, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { CarbIcono, colorFibra, FiberIcono, ProteIcono } from '@/GlobalHelper';
import { alimentosComidosSkeleton } from '../../../../../backend/src/dto/alimentos.dto';
import { FatIcono } from '@/components/icons/FatIcon';


export default function AlimentoMiniJustRead(props: { alimentoComido: alimentosComidosSkeleton }) 
{
   const icono = useRef<any>(null);
   const [hoverColor, sethoverColor] = useState<string>(""); 
   
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
            
            <Text mr="10px" color={props.alimentoComido.predomina == 0 ? "white" : "black"} fontSize="md" >
              {props.alimentoComido.calorias} kcal / {props.alimentoComido.gramosTotales} gr
            </Text>
          </Flex>
      </Box>
    </Flex>
  );
}
