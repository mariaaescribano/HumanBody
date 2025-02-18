'use client';
import { CarbsName } from '@/components/Names/CarbName';
import { FatsName } from '@/components/Names/FatsName';
import { ProteinsName } from '@/components/Names/ProteinName';
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, VStack, Input } from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
// import MeryTooltip from '../global/MeryToolTip';
// import EBookButton from '../global/EBookButton';
// import { showMacroNutrSignUp } from '../../../../backend/src/dto/recibos.dto';
// import { showEbook } from '../../../../backend/src/dto/ebook.dto';

export default function MacroNutrCardEdit(props: {title:any, totalMacro:string, total:string, screenSize:string, infoLista:string[] }) 
{
   const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Flex direction="column" w="100%">
        <div>
        {props.title == "FATS" && <FatsName fontSize="2xl" />}
        {props.title == "PROTEINS" && <ProteinsName fontSize="2xl" />}
        {props.title == "CARBS" && <CarbsName fontSize="2xl" />}
        <Box w="100%" borderBottom="2px solid black" my="20px" />
        {/* Total large screen */}
        {/* <Flex justify="center" gap="20px" mb="30px" w="100%" fontSize="xl" fontWeight="bold" wrap="wrap">
            {props.ebooklista.map((item, index) => (
                <EBookButton key={index} texto={item.title} />
            ))}
        </Flex>

            <Box w="100%" borderBottom="2px solid black" my="20px" /> */}

            {props.screenSize!= "" && (props.screenSize == "md" || props.screenSize == "xl") && 
    
            <Flex direction="column" w="100%" gap="5px">
            {
                props.infoLista.map((item, index) => (
                <Flex
                    key={index}
                    align="center"
                    w="100%"
                    gap="20px"
                    fontSize={{ base: "md", sm: "lg" }} // Cambia el tamaño de la fuente en pantallas pequeñas
                    direction={{ base: "column", sm: "row" }} // En pantallas pequeñas, los elementos se apilan verticalmente, en pantallas grandes horizontalmente
                    justify="center" // Alinea todo a la izquierda
                >
                    <HStack justify="start" gap={{ sm: "2px", md:"5px" }} align="start">
                        <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                            {item +": "}
                        </Text>
                        {/* <MeryTooltip texto={item.tooltip} /> */}
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
                    <Input
                        border="1px solid gray"
                        borderRadius={"10px"}
                        fontWeight='500'
                        variant='main'
                    
                        _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
                        h='44px'
                        maxH='44px'
                    />
                     <Text flexShrink={0}>
                            {" grams"} 
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
                    <HStack>
                        <Text flexShrink={0}>
                            {item + ": "} 
                        </Text>
                        <Input
                            
                            border="1px solid gray"
                            borderRadius={"10px"}
                            fontWeight='500'
                            variant='main'
                        
                            _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
                            h='44px'
                            maxH='44px'
                        />
                        <Text flexShrink={0}>
                            {" grams"} 
                        </Text>
                        {/* <MeryTooltip texto={item.tooltip} /> */}
                    </HStack>
                </VStack>
            ))}
            </Flex>}

            <Box w="100%" borderBottom="2px solid black" my="20px" />
            <Flex justify="center" w="100%" fontSize="xl" fontWeight={"bold"} gap="20px">
            {props.screenSize== "sm" && <Text>TOTAL {props.totalMacro} </Text>}
            {props.screenSize!== "sm" && <Text>TOTAL {props.totalMacro} :</Text>}
                <Input
                    border="1px solid gray"
                    borderRadius={"10px"}
                    fontWeight='500'
                    variant='main'
                    w="50%"
                    _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
                    h='44px'
                    maxH='44px'
                                />
                <Text> {"   grams"}</Text>
            </Flex> 
        
        </div>
    </Flex>

  );
}
