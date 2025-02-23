'use client';
// Chakra imports
import { Flex, Box, Icon, Text,  HStack, Progress } from '@chakra-ui/react';
import { CarbIcono, colorCarbs, colorFats, colorFibra, colorProte, FiberIcono, ProteIcono } from '../../../GlobalHelper';
import { FatIcono } from '../global/random/FatIcon';
import { macroPorcentajes } from '../../../../backend/src/dto/recibos.dto';

export default function MacroCalView(props: {macroPorcentaje:macroPorcentajes}) 
{
    
  
  return (
    <Box width="100%" borderRadius="20px" alignItems="center">
        <Flex mb="20px" direction="column">
            <HStack>
                <ProteIcono></ProteIcono>
                <Text mb="5px">PROTEINS</Text>
            </HStack>
           
            <Progress 
                value={props.macroPorcentaje.prote} 
                size="lg" 
                bg="#efe5e5" 
                borderRadius="20px" 
                sx={{
                    "& > div": { // Estilo del track lleno
                    backgroundColor: colorProte
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
                value={props.macroPorcentaje.grasas} 
                size="lg" 
                bg="#efe5e5"
                borderRadius="20px" 
                sx={{
                    "& > div": { // Estilo del track lleno
                    backgroundColor: colorFats
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
                value={props.macroPorcentaje.carbs} 
                size="lg" 
                bg="#efe5e5"
                borderRadius="20px" 
                sx={{
                    "& > div": { // Estilo del track lleno
                    backgroundColor: colorCarbs
                    }
                }}
            />
        </Flex>
        <Flex mb="20px" direction="column">
            <HStack>
                <FiberIcono></FiberIcono>
                <Text mb="5px">FIBER</Text>
            </HStack>
            <Progress 
                value={props.macroPorcentaje.fibra} 
                size="lg" 
                bg="#efe5e5"
                borderRadius="20px" 
                sx={{
                    "& > div": { // Estilo del track lleno
                    backgroundColor: colorFibra
                    }
                }}
            />
        </Flex>
    </Box>

  );
}
