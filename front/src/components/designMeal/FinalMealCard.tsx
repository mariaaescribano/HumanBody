'use client';
import { Flex, Box, Text, Checkbox, Button, HStack, Spinner, Link, SimpleGrid, VStack } from '@chakra-ui/react';
import { CarbIcono, colorCarbs, colorFats, colorFibra, colorProte, FiberIcono, ProteIcono, toRoman } from '@/GlobalHelper';
import { FatIcono } from '../icons/FatIcon';
import { PieChardMacroNutr } from '../global/cards/PieChardMacroNutr';
import { finalMealCard } from '../../../../backend/src/dto/meal.dto';

export default function FinalMealCard(props:{meal:finalMealCard, index:number}) 
{
    return (
        <SimpleGrid columns={{ base: 1, md: 2 }}>

            {/* pie chard y title */}
            <Flex justify="flex-start" align="center">
                <VStack>
                    <Text>{`Meal ${toRoman(props.index)}`}</Text>
                    <PieChardMacroNutr pieChartData={props.meal.pieData}></PieChardMacroNutr>
                </VStack>
            </Flex> 

            <Flex justify="flex-end" align="center">
                
            </Flex>  



        </SimpleGrid>
    );
}