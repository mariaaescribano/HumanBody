'use client';
// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, Progress } from '@chakra-ui/react';
import { useState } from 'react';
import CustomCard from '../global/CustomCard';

export default function MacroCalView(props: { }) {
 
  
  return (
    <Box width="100%" borderRadius="20px" alignItems="center">
        <Flex mb="20px" direction="column">
            <Text mb="5px">CARBS</Text>
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

        <Flex mb="20px" direction="column">
            <Text mb="5px">PROTEINS</Text>
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
            <Text mb="5px">FATS</Text>
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
    </Box>

  );
}
