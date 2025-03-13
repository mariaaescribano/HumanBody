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
                        {`Meal ${toRoman(props.index)}`}
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