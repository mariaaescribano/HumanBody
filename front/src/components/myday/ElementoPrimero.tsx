'use client';
// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, Progress, SimpleGrid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import CustomCard from '../global/cards/CustomCard';
import { CircProgressMini } from './CircProgressMini';
import MacroCalView from './MacroCalView';
import EBookButton from '../global/random/EBookButton';
import { AddIcon } from '@chakra-ui/icons';
import { macroPorcentajes } from '../../../../backend/src/dto/recibos.dto';
import { useRouter } from 'next/navigation';
import NutriComent from '../nutritionistPatient/NutriComent';
import { userNutriId } from '@/GlobalHelper';
import { nutriComentarios } from '../../../../backend/src/dto/nutri.dto';

export default function ElementoPrimero(props: { 
    macroPorcentaje: macroPorcentajes, 
    caloriasObj?: string, 
    caloriasHoy?: string 
}) {
    const router = useRouter();
    const [caloriasObj, setCaloriasObj] = useState<number>(0);
    const [caloriasHoy, setCaloriasHoy] = useState<number>(0);

    const manejarNavegacion = () => {
        router.push("/addfood/buscarAlimento");
    };

    useEffect(() => {
        if (props.caloriasHoy && props.caloriasObj) {
            setCaloriasHoy(parseInt(props.caloriasHoy, 10));
            setCaloriasObj(parseInt(props.caloriasObj, 10));
        } else {
            let caloriasHoySS = sessionStorage.getItem("caloriasDeHoy");
            let caloriasObjSS = sessionStorage.getItem("caloriasObjetivo");

            if (caloriasHoySS) {
                setCaloriasHoy(parseInt(caloriasHoySS, 10));
            }
            if (caloriasObjSS) {
                setCaloriasObj(parseInt(caloriasObjSS, 10));
            }
        }
    }, [props.caloriasHoy, props.caloriasObj]);
 
  return (
    <>
    {caloriasObj != 0 && <>
        <Box mb={{ base: "20px", md: "20px" }} alignItems={"center"} justifyContent={"center"}>
            <Flex
                justify="center"  // Centra los elementos horizontalmente
                align="center"    // Centra los elementos verticalmente
            >
                <SimpleGrid
                    w={{ base: "100%", md: "70%" }}  
                    columns={{ base: 1, md: 2 }}  // En pantallas pequeñas, 1 columna; en pantallas medianas, 2 columnas
                    spacing={{ base: "30px", md: "50px" }}  // Espacio entre los elementos
                >
                    <Box w={{ sd: "auto", md: "200px" }} mt={{ base: "0px", md: "25px", xl: "25px" }}>
                        <CircProgressMini nutriPantalla={props.caloriasHoy ? true: null}  caloriesPorAhora={caloriasHoy} caloriesObjetivo={caloriasObj} percentage={(caloriasHoy/caloriasObj)*100} />
                    </Box>
                    <MacroCalView macroPorcentaje={props.macroPorcentaje}/>
                </SimpleGrid>
            </Flex>
        </Box>
        
        {!props.caloriasObj && 
        <HStack>
            <Button
                fontSize="sm"
                borderRadius="16px"
                bg="purple.100"
                w={"100px"}
                h="40px"
                p="10px"
                _hover={{ bg: "gray.100" }}
                onClick={manejarNavegacion}
                display="flex"
                alignItems="center"
                justifyContent="center"
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    fill="black"
                    style={{ filter: "drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.1))" }}
                >
                    <path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z" />
                </svg>
            </Button>
            
            <Button
                fontSize="sm"
                borderRadius="16px"
                bg="purple.100"
                w={"100px"}
                h="40px"
                p="10px"
                color="black"
                _hover={{ bg: "gray.100" }}
                onClick={() => location.href = "../foodList"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                >
                    FOOD LIST
            </Button>
        </HStack>}

        <Box w="100%" borderBottom="2px solid black" my="20px" />
        <EBookButton texto={'Fasting'}></EBookButton>

        {/* si tiene nutricionista o es el nutricionista, entra */}
        {(sessionStorage.getItem("userNutri") || sessionStorage.getItem("patientTratando")) &&  
        <><Box w="100%" borderBottom="2px solid black" my="20px" />
        <Box  w="100%" display="flex" alignItems="center" justifyContent="center" >
            <NutriComent campo={nutriComentarios.myday} />
        </Box></>}


        {/* xxx lista de botones dependiendo del estado  */}
    </>}
    </>

  );
}
