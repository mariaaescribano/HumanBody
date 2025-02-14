'use client';
// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image } from '@chakra-ui/react';
import { useState } from 'react';

export default function FotoPrincipalInicio(props: { fotoPrincipal:any }) {
 
  
  return (
    <>
  <HStack
    w="100%" // Asegura que ocupe todo el ancho disponible
    justifyContent="center" // Centra todo horizontalmente
    spacing="20px" // Espaciado entre los elementos
  >
    {/* Botón izquierdo */}
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8B7DBE"><path d="m357.31-418.09 210.13 210.7-87.87 87.3-359.48-359.48 360.34-360.34 88.44 87.3-211.56 211.57h482.6v122.95h-482.6Z"/></svg>
    
    {/* Card */}
    <Card
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      w="300px"
      h="300px"
      maxWidth="600px"
      borderRadius="20px"
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"
    >
      <Flex
        justifyContent="center"   // Centra horizontalmente
        alignItems="center"       // Centra verticalmente
        h="100%"                  // Ocupa todo el alto del Card
      >
        <Image src={props.fotoPrincipal} alt="Fat Digestion" />
      </Flex>
    </Card>

    {/* Botón derecho */}
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8B7DBE"><path d="M602.69-418.09h-482.6v-122.95h482.6L391.13-752.61l88.44-87.3 360.34 360.34-359.48 359.48-87.87-87.3 210.13-210.7Z"/></svg>
      
  </HStack>
</>

  );
}
