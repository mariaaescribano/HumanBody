'use client';
// Chakra imports
import { Flex, Box, Icon, Text,  HStack, Progress } from '@chakra-ui/react';
import { CarbIcono, colorCarbs, colorFats, colorFibra, colorProte, FiberIcono, ProteIcono } from '../../../GlobalHelper';
import { FatIcono } from '../icons/FatIcon';
import { macroPorcentajes } from '../../../../backend/src/dto/recibos.dto';
import Advice from './Advice';

export default function MacroCalView(props: {macroPorcentaje:macroPorcentajes}) 
{
    
  console.log(props.macroPorcentaje.carbs)
  return (
    <>
    {props.macroPorcentaje && 
        <Box width="100%" borderRadius="20px" alignItems="center">

            <HStack w="100%">
                <Flex mb="20px" w="100%" direction="column" flexShrink={0}>
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
                { props.macroPorcentaje.prote > 100 && <Advice soymacro={'proteins'}></Advice>}
            </HStack>


            <HStack w="100%">
                <Flex mb="20px" w="100%" direction="column" flexShrink={0}>
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
                { props.macroPorcentaje.grasas > 100 && <Advice soymacro={'fat'}></Advice>}
            </HStack>


            <HStack w="100%">
                <Flex mb="20px" flexShrink={0} w="100%" direction="column">
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
                { props.macroPorcentaje.carbs > 100 && <Advice soymacro={'carbs'}></Advice>}
            </HStack>

            <HStack w="100%">
                <Flex mb="20px" flexShrink={0} w="100%" direction="column">
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
                { props.macroPorcentaje.fibra > 100 && <Advice soymacro={'fiber'}></Advice>}
            </HStack>
            
        </Box>}
    </>
  );
}
