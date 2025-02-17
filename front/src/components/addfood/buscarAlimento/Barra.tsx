import React, { useState } from 'react';
import { Box, Input, Text, Flex } from '@chakra-ui/react'; // Chakra UI para estilos
import {
    MdSearch
  } from 'react-icons/md';
import { CarbIcono, FatIcono, ProteIcono } from '../../../../GlobalHelper';

// Componente de búsqueda
function Barra(props: {setquienPulsado:React.Dispatch<React.SetStateAction<number>>, quienPulsado:number}) 
{
  return (
    <Box
      display="flex"
      alignItems="center"
      mt="50px"
      borderRadius="30px" // Borde redondeado en todo el contenedor principal
      overflow="hidden"
      p="5px"
      width="100%"
      maxWidth="800px" // Limita el ancho en pantallas grandes
      mx="auto" // Centra la barra en la pantalla
  >
    {/* Sección 0 */}
    <Flex
      flex="1"
      _hover={{bg: props.quienPulsado !== 0 ? "gray.100" : "gray.200"}} 
      bg= {props.quienPulsado == 0 ? "gray.200": "#610C04"}     
      justifyContent="center"
      onClick={()=> props.setquienPulsado(0)} 
      alignItems="center"
      p="10px"
    >
      <Box
        bg="white" 
        boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)" 
        p="5px"                       
        borderRadius="80px"            
      >
        <ProteIcono />
      </Box>
    </Flex>


    {/* Sección 1 */}
    <Flex
      flex="1"
      _hover={{bg: props.quienPulsado !== 1 ? "gray.100" : "gray.200"}} 
      bg= {props.quienPulsado == 1 ? "gray.200": "#abdefa"}  
      justifyContent="center"
      alignItems="center"
      onClick={()=> props.setquienPulsado(1)} 
      p="10px"
      borderLeft="2px solid black" // Borde separador
    >
      <Box
        bg="white" 
        boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)" 
        p="5px"                       
        borderRadius="80px"            
      >
        <FatIcono></FatIcono>
      </Box>
    </Flex>

    {/* Sección 2 */}
    <Flex
      flex="1"
      _hover={{bg: props.quienPulsado !== 2 ? "gray.100" : "gray.200"}} 
      bg= {props.quienPulsado == 2 ? "gray.200": "#EDC9AF"}  
      justifyContent="center"
      alignItems="center"
      onClick={()=> props.setquienPulsado(2)} 
      p="10px"
      borderLeft="2px solid black" // Borde separador
    >
      <Box
        bg="white" 
        boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)" 
        p="5px"                       
        borderRadius="80px"            
      >
        <CarbIcono></CarbIcono>
      </Box>
    </Flex>
  </Box>


  );
}

export default Barra;
