'use client';
import { Flex, Box, Text, Checkbox, Button, HStack, Spinner, Link, SimpleGrid, VStack } from '@chakra-ui/react';
import { CarbIcono, colorCarbs, colorFats, colorFibra, colorProte, FiberIcono, ProteIcono, toRoman } from '@/GlobalHelper';
import { FatIcono } from '../icons/FatIcon';
import { PieChardMacroNutr } from '../global/cards/PieChardMacroNutr';
import { finalMealCard } from '../../../../backend/src/dto/meal.dto';
import FinalMiniMacroCard from './FinalMiniMacroCard';

export default function FinalMealCard(props:{meal:finalMealCard, index:number}) 
{
    return (
        <>
        { props.meal && <SimpleGrid columns={{ base: 1, md: 2 }}>
            {/* pie chard y title */}
            <Flex justify="flex-start" align="center">
                <VStack>
                    <Text fontWeight={"bold"}>{`Meal ${toRoman(props.index)}`}</Text>
                    <PieChardMacroNutr pieChartData={props.meal.pieData}></PieChardMacroNutr>
                    <Box w="80%" borderBottom="2px solid black" mt="10px" />
                    <Text fontSize="sm" color="black" fontWeight={"bold"}>
                        TOTAL {props.meal.totalCalories} kcal
                    </Text>
                </VStack>
            </Flex> 

            {/* macros final cards */}
            <Flex justify="flex-end" align="center">
                <VStack>
                    <HStack>
                        <FinalMiniMacroCard macro={0} alimento={props.meal.prote} />
                        <FinalMiniMacroCard macro={1} alimento={props.meal.fats} />
                    </HStack>
                    <HStack>
                        <FinalMiniMacroCard macro={2} alimento={props.meal.carbs} />
                        <FinalMiniMacroCard macro={3} alimento={props.meal.carbs} />
                    </HStack>
                </VStack>
            </Flex>  
        </SimpleGrid>}
        </>
    );
}