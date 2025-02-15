'use client';
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, VStack } from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import MeryTooltip from '../global/MeryToolTip';
import EBookButton from '../global/EBookButton';
import { showMacroNutrSignUp } from '../../../../backend/src/dto/recibos.dto';
import { showEbook } from '../../../../backend/src/dto/ebook.dto';

export default function MacroNutrCard(props: {title:string, totalMacro:string, total:string, infoLista:showMacroNutrSignUp[], screenSize:string, ebooklista:showEbook[]}) 
{
   const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Flex direction="column" w="100%">
        <div>
        <Text color={textColor} fontSize="2xl" fontWeight="700">
            {props.title}
        </Text>
        <Box w="100%" borderBottom="2px solid black" my="20px" />
        {/* Total large screen */}
        <Flex justify="center" gap="20px" mb="30px" w="100%" fontSize="xl" fontWeight="bold" wrap="wrap">
            {props.ebooklista.map((item, index) => (
                <EBookButton key={index} texto={item.title} />
            ))}
        </Flex>

            <Box w="100%" borderBottom="2px solid black" my="20px" />

            {props.screenSize!= "" && (props.screenSize == "md" || props.screenSize == "xl") && 
    
            <Flex direction="column" w="100%" gap="5px">
            {
                props.infoLista.map((item, index) => (
                <Flex
                    key={index}
                    align="center"
                    w="100%"
                    fontSize={{ base: "md", sm: "lg" }} // Cambia el tamaño de la fuente en pantallas pequeñas
                    direction={{ base: "column", sm: "row" }} // En pantallas pequeñas, los elementos se apilan verticalmente, en pantallas grandes horizontalmente
                    justify="start" // Alinea todo a la izquierda
                >
                    <HStack justify="start" gap={{ sm: "2px", md:"5px" }} align="start">
                        <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                            {item.label}
                        </Text>
                        <MeryTooltip texto={item.tooltip} />
                    </HStack>

                    <Text
                        flex="1"
                        mx="8px"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        display={{ base: "none", sm: "block" }} // Oculta la línea punteada en pantallas pequeñas
                    >
                        ........................................................................................................................................................
                    </Text>
                    <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                        {item.price}
                    </Text>
                </Flex>
            ))}
            </Flex>}

            {/* Total small screen */}
            {props.screenSize!= "" && props.screenSize == "sm" && 
            <Flex direction="column" w="100%" mb="10px">
            {
                props.infoLista.map((item, index) => (
                <VStack
                    key={index}
                    align="center"
                
                    fontSize={{ base: "md", sm: "lg" }}
                    mb="20px"
                    justify="center" 
                >
                    <HStack justify="start" align="start">
                        <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                            {item.label} : {item.price}
                        </Text>
                        <MeryTooltip texto={item.tooltip} />
                    </HStack>
                </VStack>
            ))}
            </Flex>}

            <Box w="100%" borderBottom="2px solid black" my="20px" />
            <Flex justify="space-between" w="100%" fontSize="xl" fontWeight={"bold"}>
                {props.title !== "CARBS" && <Text>{props.total} </Text>}
                {props.title == "CARBS" &&<HStack justify="start" align="start">
                    <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                        {props.total}
                    </Text>
                    <MeryTooltip texto={"Fiber isn’t summed with the total carbohydrates."} />
                </HStack>} 
                <Text>{props.totalMacro} grams</Text>
            </Flex> 
        
        </div>
    </Flex>

  );
}
