'use client';
// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, Progress, SimpleGrid } from '@chakra-ui/react';
import { useState } from 'react';
import CustomCard from '../global/cards/CustomCard';
import { CircProgressMini } from './CircProgressMini';
import MacroCalView from './MacroCalView';
import EBookButton from '../global/random/EBookButton';
import { AddIcon } from '@chakra-ui/icons';

export default function ElementoPrimero(props: { }) {
 
  return (
    <>
        <Box mb={{ base: "20px", md: "50px" }} alignItems={"center"} justifyContent={"center"}>
            <Flex
                justify="center"  // Centra los elementos horizontalmente
                align="center"    // Centra los elementos verticalmente
            >
                <SimpleGrid
                    w={{ base: "100%", md: "70%" }}  
                    columns={{ base: 1, md: 2 }}  // En pantallas pequeñas, 1 columna; en pantallas medianas, 2 columnas
                    spacing={{ base: "30px", md: "50px" }}  // Espacio entre los elementos
                >
                    <Box w={{ sd: "auto", md: "200px" }} mt={{ base: "0px", md: "25px", xl: "25px" }}>
                        <CircProgressMini caloriesPorAhora={'1300'} caloriesObjetivo={'2000'} percentage={66} />
                    </Box>
                    <MacroCalView />
                </SimpleGrid>
            </Flex>
        </Box>

        <Button
        fontSize="sm"
        borderRadius="16px"
        bg="purple.100"
        w="50%"
        h="auto"
        p="10px"
        _hover={{bg:"gray.100"}}
        rightIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z"/></svg>}
        onClick={()=> location.href = "../addfood/buscarAlimento"}
        >
        </Button>

        <Box w="100%" borderBottom="2px solid black" my="20px" />
        <EBookButton texto={'Fasting'}></EBookButton>
        {/* lista de botones dependiendo del estado  */}
    </>

  );
}
