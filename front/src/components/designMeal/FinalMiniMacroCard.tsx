'use client';
import { Flex, Box, Text, Checkbox, Button, HStack, Spinner, Link, SimpleGrid, VStack } from '@chakra-ui/react';
import { CarbIcono, colorCarbs, colorFats, colorFibra, colorProte, FiberIcono, ProteIcono, toRoman } from '@/GlobalHelper';
import { FatIcono } from '../icons/FatIcon';
import { PieChardMacroNutr } from '../global/cards/PieChardMacroNutr';
import { alimentoMacroMealView, finalMealCard } from '../../../../backend/src/dto/meal.dto';

export default function FinalMiniMacroCard(props: {macro:number, alimento:alimentoMacroMealView}) {
    const iconos = [ProteIcono, FatIcono, CarbIcono, FiberIcono];
    const colores = [colorProte, colorFats, colorCarbs, colorFibra];
    const titles = ["PROTEINS", "FATS", "CARBS", "FIBER"];
  
    const index =
      typeof props.macro === "number" && props.macro >= 0 && props.macro < iconos.length
        ? props.macro
        : 0;
  
    const Icono = iconos[index] ?? null;
    const color = colores[index] ?? "gray.200";
    const title = titles[index] ?? "UNKNOWN";


    return (
        <>
        {props.alimento && <Box w="150px" h="auto" bg={props.alimento.nombreFuente != "" ? color : "gray.100"} borderRadius="15px" p="20px">
            <VStack>
                <HStack justifyContent="center" mt="-5px">
                    <Box
                        bg="white"
                        boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
                        p="5px"
                        borderRadius="80px"
                        mr="5px"
                    >
                        {Icono && <Icono />}
                    </Box>
                    <Text color="white" fontWeight="500">{title}</Text>
                </HStack>

                <Box
                    color="white"
                    ml="0px"
                    flex="1"
                    wordBreak="break-word"
                    whiteSpace="normal"
                >
                    <VStack>
                        <Text fontSize="sm">
                            {props.alimento.nombreFuente} : 
                        </Text>
                        <Text fontSize="sm">
                            {props.alimento.gramosFuente} grams
                        </Text>
                    </VStack>
                </Box>

                <Box w="100%" borderBottom="2px solid white" />

                <Text fontSize="sm" color="white">
                    TOTAL: {props.alimento.gramosMacro} g
                </Text>

            </VStack>
        </Box>}
        </>
    );
}