import React, { useState } from 'react';
import { Box, Input, Text, Flex, Card } from '@chakra-ui/react'; // Chakra UI para estilos
import {
    MdSearch
  } from 'react-icons/md';


// Componente de búsqueda
function BarraMenu() 
{
  return (
    <Card
        p={"20px"} 
        width={{ base: "90%", md: "100%" }} 
        mb={"20px"} 
        maxWidth="800px" 
        maxHeight="20px" 
        align="center" 
        justify="center" 
        direction="row"
        borderRadius={"13px"}
        bg="purple.100"
        border="2px solid white" 
    >
        <Flex
        flex="1"   
        justifyContent="center"
        onClick={()=> location.href = ""} 
        alignItems="center"

        >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"/></svg>
        </Flex>

        <Flex
        flex="1"   
        justifyContent="center"
        onClick={()=> location.href = ""} 
        alignItems="center"

        borderLeft={ "2px solid white"}
        >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"/></svg>
        </Flex>
    </Card>


  );
}

export default BarraMenu;
