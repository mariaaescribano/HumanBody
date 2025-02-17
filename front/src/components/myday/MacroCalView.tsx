'use client';
// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, Progress } from '@chakra-ui/react';
import { useState } from 'react';
import CustomCard from '../global/CustomCard';
import { CarbIcono, FatIcono, ProteIcono } from '../../../GlobalHelper';

export default function MacroCalView(props: { }) {
 
  
  return (
    <Box width="100%" borderRadius="20px" alignItems="center">
        <Flex mb="20px" direction="column">
            <HStack>
                <ProteIcono></ProteIcono>
                <Text mb="5px">PROTEINS</Text>
            </HStack>
           
            <Progress 
                value={60} 
                size="lg" 
                bg="#efe5e5" 
                borderRadius="20px" 
                sx={{
                    "& > div": { // Estilo del track lleno
                    backgroundColor: "#610C04"
                    }
                }}
            />
        </Flex>
        <Flex mb="20px" direction="column">
            <HStack>
                <FatIcono></FatIcono>
                <Text mb="5px">FATS</Text>
            </HStack>
            <Progress 
                value={60} 
                size="lg" 
                bg="#efe5e5"
                borderRadius="20px" 
                sx={{
                    "& > div": { // Estilo del track lleno
                    backgroundColor: "#abdefa"
                    }
                }}
            />
        </Flex>
        <Flex mb="20px" direction="column">
            <HStack>
                <CarbIcono></CarbIcono>
                <Text mb="5px">CARBS</Text>
            </HStack>
            <Progress 
                value={60} 
                size="lg" 
                bg="#efe5e5"
                borderRadius="20px" 
                sx={{
                    "& > div": { // Estilo del track lleno
                    backgroundColor: "#EDC9AF"
                    }
                }}
            />
        </Flex>
    </Box>

  );
}
