'use client';
import { Flex, Box, Text, Checkbox, Button, HStack, Spinner, Link, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import MacroMiniCards from './MacroMiniCards';
import { mealSkeleton } from '../../../../backend/src/dto/meal.dto';
import { toRoman } from '@/GlobalHelper';

export default function MainCards(props:{ meal: mealSkeleton, index:number }) 
{
    // ESTRATEGIA
    // si esta sin rellenar, el boton esta a color, sino esta desactivado
    // se pasa los datos de cada macro en MacroMinicards (siempre seran 4)

    return (
        <>
            { props.meal && 
            <Box w="310px" h="auto"  >
                <Box display="flex" justifyContent="center" mb="20px">
                    <Button w="200px" borderRadius="10px" bg={props.meal.relleno == true ? "gray.100" : "purple.100"} 
                    isDisabled={props.meal.relleno == true ? true : false} 
                    onClick={()=> location.href = `./mealDeciding?mealIndex=${props.index}`}>
                        <HStack>
                            <svg xmlns="http://www.w3.org/2000/svg" height="26px" style={{ filter: "drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.1))" }} viewBox="0 -960 960 960" width="26px" fill="#00000"><path d="m358.15-505.84 88.7-89.31-69.08-69.7-45.16 45.16-42.15-42.15L335-707l-61.54-61.54-89.31 89.31 174 173.39Zm320.7 321.3 89.3-89.31-61.54-61.54-45.15 44.54L619.31-333l44.54-45.15-69.31-68.7-88.7 88.7 173.01 173.61ZM697.46-760l63.16 63.15L697.46-760ZM288.08-140H140v-148.08l175.39-175.38L100-679.23l173.46-173.46 216.77 216.38 164.85-165.46q9.31-9.31 20.46-13.77 11.15-4.46 23.31-4.46 12.15 0 23.3 4.46 11.16 4.46 20.46 13.77l59.16 60.93q9.31 9.3 13.57 20.46 4.27 11.15 4.27 23.3 0 12.16-4.27 22.81-4.26 10.65-13.57 19.96L637.69-489.23l215 215.77L679.23-100 463.46-315.39 288.08-140ZM200-200h62.54l392.38-391.77-63.15-63.15L200-262.54V-200Zm423.85-423.23-32.08-31.69 63.15 63.15-31.07-31.46Z"/></svg>
                            <Text fontSize='sm' ms='2px'fontWeight="bold">
                                {`Meal ${toRoman(props.index)}`}
                            </Text>
                        </HStack>
                    </Button>
                </Box>

                <VStack spacing={2}>
                    <MacroMiniCards macro={0} totalMacro={props.meal.proteTotal} fuenteMacro={props.meal.fuenteProte} gramosFuenteMacro={props.meal.gramosFuenteProte}/>
                    <MacroMiniCards macro={1} totalMacro={props.meal.fatTotal} fuenteMacro={props.meal.fuenteFat} gramosFuenteMacro={props.meal.gramosFuenteFat}/>
                    <MacroMiniCards macro={2} totalMacro={props.meal.carbsTotal} fuenteMacro={props.meal.fuenteCarbs} gramosFuenteMacro={props.meal.gramosFuenteCarbs}/>
                    <MacroMiniCards macro={3} totalMacro={props.meal.fibraTotal} fuenteMacro={props.meal.fuenteFibra} gramosFuenteMacro={props.meal.gramosFuenteFibra}/>
                </VStack>

            </Box>}
        </>
    );
}