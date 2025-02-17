'use client'

import CustomCard from "@/components/global/CustomCard"
import {
    Text, Box, Flex,
    HStack,VStack
  } from '@chakra-ui/react';
import { FatIcono } from "../../../../GlobalHelper";


export default function AlimentoMiniCard(props: {nameAlimento:string, predomina:string}) {

  return (
    <Flex
    justifyContent="flex-start"
    alignItems="center"
    bg="white"
    p="5px"
    mt="10px"
    direction={"column"}
    borderRadius="20px"
    cursor="pointer"
    _hover={{ bg: "gray.100" }}
    width="100%"
    // border="2px solid #610C04"
    mx="auto"  // Asegura que el contenedor se centre (si es necesario)
  >
    
    {/* Contenedor con el texto */}
    <HStack >
    <FatIcono/>
    <Box ml="10px">
   
      <Text
        color="black"
        fontSize="md"
        w="100%"
        fontWeight="700"
        textAlign="left"
      >
        {props.nameAlimento}
      </Text>
      <Text color="gray.500" fontSize="10px" w="100%" textAlign="left">
        54 kcal / 100gr
      </Text>
    </Box>
    </HStack>
  </Flex>
  
  );
}
