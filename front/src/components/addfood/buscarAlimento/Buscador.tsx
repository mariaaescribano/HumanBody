import React, { useState } from 'react';
import { Box, Input, Icon } from '@chakra-ui/react'; // Chakra UI para estilos
import {
    MdSearch
  } from 'react-icons/md';

// Componente de búsqueda
function Buscador(props: {marginLeft?:string}) {

  return (
    <Box 
        display="flex" 
        alignItems="center" 
        bg="gray.100" 
        mt="20px"
        p="10px"
        borderRadius="30px" 
        width="100%" 
    >
        <Icon as={MdSearch} width="24px" height="24px" color="gray.500" /> 
        <Input
            placeholder={"Search a food"}
            variant="unstyled"
            border="none"
            p="2"
            fontSize="lg"
            width="100%"
            ml="2" // Espaciado entre el icono y el input
        />
    </Box>

  );
}

export default Buscador;
