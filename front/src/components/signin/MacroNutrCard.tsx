'use client';
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, VStack } from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import MeryTooltip from '../global/random/MeryToolTip';
import EBookButton from '../global/random/EBookButton';
import { showMacroNutrSignUp } from '../../../../backend/src/dto/recibos.dto';
import { showEbook } from '../../../../backend/src/dto/ebook.dto';
import { FatsName } from '../Names/FatsName';
import { ProteinsName } from '../Names/ProteinName';
import { CarbsName } from '../Names/CarbName';
import NutriComent from '../nutritionistPatient/NutriComent';
import { userNutriId } from '@/GlobalHelper';
import { nutriComentarios } from '../../../../backend/src/dto/nutri.dto';

export default function MacroNutrCard(props: {title:string, total:string, stillNeed?:boolean,
    reciboObjetivo?: number, verMensajesNutri?:boolean, 
    infoLista?:showMacroNutrSignUp[], screenSize:string, ebooklista?:showEbook[]}) 
{

  return (
    <Flex direction="column" w="100%">
        <div>
        {props.title == "FATS" && <FatsName fontSize="2xl" />}
        {props.title == "PROTEINS" && <ProteinsName fontSize="2xl" />}
        {props.title == "CARBS" && <CarbsName fontSize="2xl" />}
        <Box w="100%" borderBottom="2px solid black" my="20px" />
        {/* Total large screen */}
        <Flex justify="center" gap="20px" mb="30px" w="100%" fontSize="xl" fontWeight="bold" wrap="wrap">
            {props.ebooklista?.map((item, index) => (
                <EBookButton key={index} texto={item.title} type={item.type} />
            ))}
        </Flex>

            <Box w="100%" borderBottom="2px solid black" my="20px" />

            {props.screenSize!= "" && (props.screenSize == "md" || props.screenSize == "xl") && 
    
            <Flex direction="column" w="100%" gap="5px">
            {
                props.infoLista?.map((item, index) => (
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
                    <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                        {item.price.includes("NaN") ? "0 grams" : item.price}
                    </Text>
                </Flex>
            ))}
            </Flex>}

            {/* Total small screen */}
            {props.screenSize!= "" && props.screenSize == "sm" && 
            <Flex direction="column" w="100%" mb="10px">
            {
                props.infoLista?.map((item, index) => (
                <VStack
                    key={index}
                    align="center"
                    fontSize={{ base: "md", sm: "lg" }}
                    mb="20px"
                    justify="center" 
                >
                    <HStack justify="start" align="start">
                        <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                            {item.label} : {item.price.includes("NaN") ? "0 grams" : item.price}
                        </Text>
                    </HStack>
                </VStack>
            ))}
            </Flex>}

            <Box w="100%" borderBottom="2px solid black" my="20px" />
            {!props.stillNeed &&  <Flex justify="space-between" w="100%" fontSize="xl" fontWeight={"bold"}>
                <Text>{"TOTAL"} </Text>
                <Text>{ isNaN(Number(props.total)) ? 0 : props.total} grams</Text>
            </Flex> }

            {props.stillNeed && props.stillNeed == true && 
            <>
            <Flex justify="space-between" w="100%" fontSize="xl" fontWeight={"bold"}>
                <Text>{"TOTAL PER NOW"} </Text>
                <Text>{ isNaN(Number(props.total)) ? 0 : props.total} grams</Text>
            </Flex>

            <Box w="100%" borderBottom="2px solid black" my="20px" />
            <Flex justify="space-between" w="100%" fontSize="lg" fontWeight={"bold"}>
                <Text>{"STILL NEED"} </Text>
                <Text>{ isNaN(Number(props.reciboObjetivo)) ? 0 : props.reciboObjetivo} grams</Text>
            </Flex> </>}
            
            {/* si tiene nutricionista o es el nutricionista, entra */}
            {/* para el dia de hoy */}
            {props.verMensajesNutri && props.stillNeed == true && (sessionStorage.getItem("userNutri") || sessionStorage.getItem("patientTratando")) &&  
            <>
            <Box display="flex" alignItems="center" justifyContent="center" >
                <NutriComent 
                    campo={{
                        PROTEINS: nutriComentarios.proteMyDay,
                        FATS: nutriComentarios.fatsMyDay,
                        CARBS: nutriComentarios.carbsMyDay
                    }[props.title]} />
            </Box></>}
            {/* para objetivos */}
            {props.verMensajesNutri && !props.stillNeed && (sessionStorage.getItem("userNutri") || sessionStorage.getItem("patientTratando")) &&  
            <>
            <Box display="flex" alignItems="center" justifyContent="center" >
                <NutriComent 
                    campo={{
                        PROTEINS: nutriComentarios.prote,
                        FATS: nutriComentarios.fats,
                        CARBS: nutriComentarios.carbs
                    }[props.title]} />
            </Box></>}


        </div>
    </Flex>
  );
}
