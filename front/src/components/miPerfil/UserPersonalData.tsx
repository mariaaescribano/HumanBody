'use client';
// Chakra imports
import { Box, Avatar, Flex, Text, HStack, VStack, Input } from '@chakra-ui/react';
import CustomCard from '../global/cards/CustomCard';
import { createUserSkeleton } from '../../../../backend/src/dto/usuarios.dto';
import { exerciseFrequencyList, objectivesList } from '@/GlobalHelper';
import MeryTooltip from '../global/random/MeryToolTip';
import { CaloryIcon } from '../icons/CaloryIcon';
import SelectSignIn from '../signin/SelectSignIn';
import NutriComent from '../nutritionistPatient/NutriComent';

export default function UserPersonalData(props: { user : createUserSkeleton, editando:boolean,
    activityLevelIndex:number , objectiveIndex:number, TMB?:string, caloriesWithLifeStyle?:string, caloriesWithObjective:string,
    screenSize:string}) {

  return (
    <CustomCard mt="15px" hijo={ 
        <>
          <Box w="100%" borderBottom="2px solid black" my="20px" />
          <Flex direction="column" w="100%" >
              {[
                  { label: "Gender", price:  props.user.genero },
                  { label: "Weight", price: props.user.peso +" kg" },
                  { label: "Height", price: props.user.altura+" cm" },
                  { label: "Activity level", price:  exerciseFrequencyList[props.activityLevelIndex].label },
                  { label: "Objective", price:  objectivesList[props.objectiveIndex].label }
  
              ].map((item, index) => (
                <Flex key={index} align="center" w="100%" fontSize="lg">
                    {/* Item Name */}
                    <Text flexShrink={0}>{item.label}</Text>
                    
                    {/* Dotted Line (Flexible) */}
                    <Text flex="1" mx="8px" whiteSpace="nowrap" overflow="hidden">
                        ........................................................................................................................................................
                    </Text>
                
                    {/* Price */}
                    <Text flexShrink={0}>{item.price}</Text>
                </Flex>
            
              ))}
  
            <Box w="100%" borderBottom="2px solid black" my="20px" />
  
            {/* Total large screen */}
            {props.screenSize!= "" && (props.screenSize == "md" || props.screenSize == "xl") && 
            <Flex direction="column" w="100%">
            {[
              { label: "Your basal calories are", price: `${props.TMB} kcal`, tooltip: "These are the calories that you need to exist :)" },
          
              // Second item
              props.editando === false
                ? { label: "With your lifestyle, it would change to", price: `${props.caloriesWithLifeStyle} kcal`, tooltip: "These are the calories that you need to have with your lifestyle." }
                : null,
          
              // Third item (always shown)
              { label: "With your objective, it would change to", price: `${props.caloriesWithObjective} kcal`, tooltip: "These are the calories that you need to obtain your goal." }
            ]
              .filter(item => item !== null) // Remove null values from the array
              .map((item, index) => (
                <Flex
                    key={index}
                    align="center"
                    w="100%"
                    fontSize={{ base: "md", sm: "lg" }} // Cambia el tamaño de la fuente en pantallas pequeñas
      
                    direction={{ base: "column", sm: "row" }} // En pantallas pequeñas, los elementos se apilan verticalmente, en pantallas grandes horizontalmente
                    justify="start" // Alinea todo a la izquierda
                >
                    {/* Información del título y tooltip alineados a la izquierda */}
                    <HStack justify="start" gap="5px" align="start">
                        <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                            {item.label}
                        </Text>
                        <MeryTooltip texto={item.tooltip} />
                    </HStack>
  
                    {/* Dotted Line (Flexible) */}
                    <Text
                        flex="1"
                        mx="8px"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        display={{ base: "none", sm: "block" }} // Oculta la línea punteada en pantallas pequeñas
                    >
                        ........................................................................................................................................................
                    </Text>
  
                    {/* Price */}
                    <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                        {item.price}
                    </Text>
                </Flex>
            ))}
            </Flex>}
  
            {/* Total small screen */}
            {props.screenSize!= "" && props.screenSize == "sm" && 
           <Flex direction="column" w="100%" mb="10px">
           {[
            { label: "Your basal calories are", price: `${props.TMB} kcal`, tooltip: "These are the calories that you need to exist :)" },
         
             // Second item
             props.editando === false
               ? { label: "With your lifestyle, it would change to", price: `${props.caloriesWithLifeStyle} kcal`, tooltip: "These are the calories that you need to have with your lifestyle." }
               : null,
         
             // Third item (always shown)
             { label: "With your objective, it would change to", price: `${props.caloriesWithObjective} kcal`, tooltip: "These are the calories that you need to obtain your goal." }
           ]
             .filter(item => item !== null) // Remove null values from the array
             .map((item, index) => (
                <VStack
                    key={index}
                    align="center"
                    w="100%"
                    fontSize={{ base: "md", sm: "lg" }}
                    mb="20px"
                    justify="center" 
                >
                    <HStack gap="5px">
                        <Text>
                            {item.label}
                        </Text>
                        <MeryTooltip texto={item.tooltip} />
                    </HStack>
                    <Text  align="center">
                        {item.price}
                    </Text>
                </VStack>
            ))}
            </Flex>}
  
  
            {/* Horizontal Line */}
            <Box w="100%" borderBottom="2px solid black" my="20px" />
            <Flex justify="space-between" w="100%" fontSize="xl" fontWeight={"bold"}>
              <HStack>
                <CaloryIcon />
                <Text>TOTAL CALORIES </Text>
              </HStack>
                <Text>{props.caloriesWithObjective} kcal</Text>
            </Flex>

            <Box w="100%" borderBottom="2px solid black" my="20px" />
            <Box display="flex" alignItems="center" justifyContent="center" >
                <NutriComent text={'Remember to focus on muscle weight. '} />
            </Box>
          
          </Flex>
        </>} >
    </CustomCard>
  );
}
