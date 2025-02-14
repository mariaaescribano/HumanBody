'use client';
// Chakra imports
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Icon,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import { API_URL, exerciseFrequencyList, StringIsNull, objectivesList, ObjectIsNull, getTamanyoPantalla } from '../../../../../GlobalHelper';
import { createUser } from '../../../../../../backend/src/dto/usuarios.dto';
import { MdArrowBack } from 'react-icons/md';
import PurpleSpinner from '@/components/global/Spinner';
import { reciboSkeleton } from '@/dto/recibo.dto';
import MeryTooltip from '@/components/global/MeryToolTip';
import EBookButton from '@/components/global/EBookButton';
import CustomCard from '@/components/global/CustomCard';

export default function SignUp3() 
{
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const [user, setUser] = useState<createUser | null>(null);
    const [recibo, setrecibo] = useState<reciboSkeleton | null>(null);
    const [screenSize, setscreenSize] = useState<string>("");
    const objectiveIndex = useRef<number>(0);


    useEffect(() => 
    {
        const userStr = sessionStorage.getItem("user");
        getTamanyoPantalla(setscreenSize)
        if (userStr) 
        {
        const user = JSON.parse(userStr); 
        setUser(user)

        let index = sessionStorage.getItem("objectiveIndex");
        if(index)
        {
            objectiveIndex.current = parseInt(index, 10);
            calculaMacros(parseInt(user.calorias_objetivo, 10));
        }
        }
        else
        location.href = '../signup/parte2';
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // con los datos del usuario calcula los macros 
    const calculaMacros = (caloriasTotal:number) =>
    {
        let proteTotalPorcentaje = 0;
        let grasasTotalPorcentaje = 0;
        let carbsTotalPorcentaje = 0;

        //obtener PORCENTAJES dependiendo de su objetivo
        if(objectiveIndex.current == 0) // lose
        { 
            proteTotalPorcentaje= 35
            grasasTotalPorcentaje= 25
            carbsTotalPorcentaje= 40
        }
        if(objectiveIndex.current == 1) // muscle
        { 
            proteTotalPorcentaje= 25
            grasasTotalPorcentaje= 28
            carbsTotalPorcentaje= 50
        }
        if(objectiveIndex.current == 2)
        { 
            proteTotalPorcentaje= 30
            grasasTotalPorcentaje= 25
            carbsTotalPorcentaje= 50
        }

        // operaciones para obtener GRAMOS exactos
        let proteTotal = Math.round((proteTotalPorcentaje*caloriasTotal) / (4*100));
        let grasasTotal = Math.round((grasasTotalPorcentaje*caloriasTotal) / (9*100));
        let carbsTotal = Math.round((carbsTotalPorcentaje*caloriasTotal) / (4*100));

        // especificar mas a fondo
        let proteCompletas = Math.round(proteTotal * (75/100));
        let proteIncompletas = Math.round(proteTotal * (25/100));

        let grasasSaturadas = Math.round((10* caloriasTotal) / (100*9));
        let Monoinsaturadas = Math.round((45 * grasasTotal) / 100);
        let Poliinsaturadas = Math.round((35* grasasTotal) / 100);

        let carbsComplejas = Math.round(carbsTotal * (80/100));
        let carbsSimples = Math.round(carbsTotal * (20/100));

        let cantidad = Math.round(caloriasTotal/1000);
        let fibra = cantidad * 14;

        const reciboCuerpo:reciboSkeleton=
        {
            grasas:grasasTotal.toString(),
            monoinsaturadas:Monoinsaturadas.toString(),
            poliinsaturadas:Poliinsaturadas.toString(),
            saturadas:grasasSaturadas.toString(),
            prote:proteTotal.toString(),
            incompleto:proteIncompletas.toString(),
            completo:proteCompletas.toString(),
            carbs:carbsTotal.toString(),
            complejos:carbsComplejas.toString(),
            simples:carbsSimples.toString(),
            fibra:fibra.toString()
        } 

        setrecibo(reciboCuerpo)
    };


    // xxx cuando el usuario lo acepta, se crea un recibo, una ficha y esos ids se guardan en la tabla usuarios
    const letsgo = () =>
    {
        //borrar session
        sessionStorage.clear();
        crear();
    
    };

    const crear = async () => 
    {
        if(recibo!= null)
        {
            let idRecibo = await crearRecibo();
            if(idRecibo)
            {
                setUser(prevUser => {
                    if (prevUser) {
                    return {
                        ...prevUser,  // Mantiene los otros campos
                        recibo: idRecibo // Cambia solo el campo 'name'
                    };
                    }
                    return prevUser;  // En caso de que `user` sea null, se devuelve tal cual
                });
            }
        }
    };

    useEffect(() => 
    {
        if(user!= null && !Number.isNaN(user?.recibo))
            crearUsuario();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    

    const crearRecibo = async () => 
    {
        try{
        const response = await axios.post(
            `${API_URL}/recibos/createRecibo`,
            recibo,
            {
            headers: {
                'Content-Type': 'application/json'
            },
            }
        );
        if(response.data != null)
            return response.data;
        }
        catch (error) {
        console.error('Error fetching data:', error);
        }
    };


    const crearUsuario = async () => 
    {
        try{
        const createNewUser = await axios.post(
            `${API_URL}/usuarios/createUser`,
            user,
            {
            headers: {
                'Content-Type': 'application/json'
            },
            }
        );
        console.log(createNewUser.data)
        }
        catch (error) {
        console.error('Error fetching data:', error);
        }
    };



    return (
        <Flex
        direction="column"
        align="center"
        bg="purple.100"
        w="100%"
        h="100%"
        justify="center"
        minH="100vh"
        position={"relative"}
        >


            {!ObjectIsNull(recibo) && recibo != null && 
            <CustomCard hijo={ 
                <Flex 
                align="center"
                w="100%"
                fontSize={{ base: "md", sm: "lg" }} // Cambia el tamaño de la fuente en pantallas pequeñas
                direction="column" // En pantallas pequeñas, los elementos se apilan verticalmente, en pantallas grandes horizontalmente
                justify="center" // Alinea todo a la izquierda
            >
                <HStack justify="start" gap="5px" align="start" mb="10px">
                <Text color={textColor} fontSize="2xl" fontWeight="700">
                Personal designed plan
                </Text>
                    <MeryTooltip texto={"This is a science-based plan, but if you feel uncomfortable, feel free to change it or talk with an expert :)"} />
                </HStack>
                <HStack 
                    align="center"
                    justify="center" 
                    spacing="10px"
                    p="5px"
                >
                    <Button
                        variant="darkBrand"
                        fontSize="sm"
                        borderRadius="16px"
                        bg="purple.100"
                        w={{ base: '128px', md: '148px' }}
                        h="46px"
                        _hover={{ bg: "gray.100" }}
                        onClick={() => location.href = "./parte2"}
                        leftIcon={<Icon as={MdArrowBack} />}
                    >
                        No, go back
                    </Button>
                    <Button
                        variant="darkBrand"
                        fontSize="sm"
                        borderRadius="16px"
                        bg="purple.100"
                        w={{ base: '128px', md: '148px' }}
                        h="46px"
                        onClick={letsgo}
                        _hover={{ bg: "gray.100" }}
                        leftIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m536-84-56-56 142-142-340-340-142 142-56-56 56-58-56-56 84-84-56-58 56-56 58 56 84-84 56 56 58-56 56 56-142 142 340 340 142-142 56 56-56 58 56 56-84 84 56 58-56 56-58-56-84 84-56-56-58 56Z"/></svg>}
                    >
                        Yes, let's go!
                    </Button>
                </HStack>
            </Flex>} >
            </CustomCard>}


            {!ObjectIsNull(recibo) && recibo != null && 
            <CustomCard hijo={ 
                <Flex direction="column" w="100%">
                    {/* PROTEINS */}
                    <div>
                    {/* Total large screen */}
                        <Flex justify="center" gap="20px" mb="30px" w="100%" fontSize="xl" fontWeight={"bold"} wrap="wrap">
                            <EBookButton texto={'What are amino acids?'}></EBookButton>
                            <EBookButton texto={'How proteins repair my cells?'}></EBookButton>
                        </Flex>
                        <Box w="100%" borderBottom="2px solid black" my="20px" />

                        {screenSize!= "" && (screenSize == "md" || screenSize == "xl") && 
                
                        <Flex direction="column" w="100%">
                        {[
                            { label: "Complete proteins", price: `${recibo.completo} grams`, tooltip: "Contain all essential amino acids your body needs for regeneration." },
                            { label: "Incomplete proteins", price: `${recibo.incompleto} grams`, tooltip: "Lack one or more essential amino acids needed for regeneration."},].map((item, index) => (
                            <Flex
                                key={index}
                                align="center"
                                w="100%"
                                fontSize={{ base: "md", sm: "lg" }} // Cambia el tamaño de la fuente en pantallas pequeñas
                                mb="20px"
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
                        {screenSize!= "" && screenSize == "sm" && 
                        <Flex direction="column" w="100%" mb="10px">
                        {[
                            { label: "Complete proteins", price: `${recibo.completo} grams`, tooltip: "Contain all essential amino acids your body needs for regeneration." },
                            { label: "Incomplete proteins", price: `${recibo.incompleto} grams`, tooltip: "Lack one or more essential amino acids needed for regeneration."},].map((item, index) => (
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
                            <Text>TOTAL PROTEINS </Text>
                            <Text>{recibo.prote} grams</Text>
                        </Flex> 
                    
                    </div>
                </Flex>} >
            </CustomCard>} 


            {!ObjectIsNull(recibo) && recibo != null && 
            <CustomCard hijo={ 
                <Flex direction="column" w="100%">
                    {/* FAT */}
                    <div>
                    {/* Total large screen */}
                    {screenSize!= "" && (screenSize == "md" || screenSize == "xl") && 
                    <Flex direction="column" w="100%">
                    {[
                        { label: "Monounsaturated", price: `${recibo.monoinsaturadas} grams`, tooltip: "Heart-friendly fats that support cholesterol balance and overall health." },
                        { label: "Polyunsaturated", price: `${recibo.poliinsaturadas} grams`, tooltip: "Essential fats, including omega-3 and omega-6, crucial for brain and cell function."},
                        { label: "Saturated", price: `${recibo.saturadas} grams`, tooltip: "Stable fats that provide energy but should be consumed in moderation."},].map((item, index) => (
                        <Flex
                            key={index}
                            align="center"
                            w="100%"
                            fontSize={{ base: "md", sm: "lg" }} 
                            mb="20px"
                            direction={{ base: "column", sm: "row" }} 
                            justify="start"
                        >
                            <HStack justify="start" gap="5px" align="start">
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
                {screenSize!= "" && screenSize == "sm" && 
                <Flex direction="column" w="100%" mb="10px">
                {[
                    { label: "Monounsaturated", price: `${recibo.monoinsaturadas} grams`, tooltip: "Heart-friendly fats that support cholesterol balance and overall health." },
                    { label: "Polyunsaturated", price: `${recibo.poliinsaturadas} grams`, tooltip: "Essential fats, including omega-3 and omega-6, crucial for brain and cell function."},
                    { label: "Saturated", price: `${recibo.saturadas} grams`, tooltip: "Stable fats that provide energy but should be consumed in moderation."},].map((item, index) => (
                    <VStack
                        key={index}
                        align="center"
                        w="100%"
                        fontSize={{ base: "md", sm: "lg" }}
                        mb="20px"
                        justify="center" 
                    >
                        <HStack justify="start" gap="5px" align="start">
                            <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                            {item.label} : {item.price}
                            </Text>
                            <MeryTooltip texto={item.tooltip} />
                        </HStack>
                    </VStack>
                ))}
                </Flex>}

                <Box w="100%" borderBottom="2px solid black" my="20px" />
                <Flex justify="space-between" w="100%" fontSize="xl" fontWeight={"bold"} mb="30px" >
                    <Text>TOTAL FATS </Text>
                    <Text>{recibo.grasas} grams</Text>
                </Flex> 
                <Flex justify="center" gap="20px" w="100%" fontSize="xl" fontWeight={"bold"} wrap="wrap">
                    <EBookButton texto={'How monounsaturated fats helps me?'}></EBookButton>
                    <EBookButton texto={'How polyunsaturated fats helps me?'}></EBookButton>
                    <EBookButton texto={'Why saturated fats can hurt me?'}></EBookButton>
                </Flex>
                </div>
                </Flex>} >
            </CustomCard>} 

            

            {!ObjectIsNull(recibo) && recibo != null && 
            <CustomCard hijo={ 
                <Flex direction="column" w="100%">
                    {/* CARBS */}
                    <div>
                    {/* Total large screen */}
                    {screenSize!= "" && (screenSize == "md" || screenSize == "xl") && 
                    <Flex direction="column" w="100%">
                    {[
                        { label: "Fiber", price: `${recibo.fibra} grams`, tooltip: "Fiber promotes healthy digestion, supports heart health, helps regulate blood sugar levels and support neuron and brain activity."},
                        { label: "Complex", price: `${recibo.complejos} grams`, tooltip: "Provide long-lasting energy and fiber, digesting slowly."},
                        { label: "Simples", price: `${recibo.simples} grams`, tooltip: "Digest quickly, giving a fast but short energy boost."},].map((item, index) => (
                        <Flex
                            key={index}
                            align="center"
                            w="100%"
                            fontSize={{ base: "md", sm: "lg" }} 
                            mb="20px"
                            direction={{ base: "column", sm: "row" }} 
                            justify="start"
                        >
                            <HStack justify="start" gap="5px" align="start">
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
                    {screenSize!= "" && screenSize == "sm" && 
                    <Flex direction="column" w="100%" mb="10px">
                    {[
                        { label: "Fiber", price: `${recibo.fibra} grams`, tooltip: "Fiber promotes healthy digestion, supports heart health, helps regulate blood sugar levels and support neuron and brain activity."},
                        { label: "Complex", price: `${recibo.complejos} grams`, tooltip: "Provide long-lasting energy and fiber, digesting slowly."},
                        { label: "Simples", price: `${recibo.simples} grams`, tooltip: "Digest quickly, giving a fast but short energy boost."},].map((item, index) => (
                        <VStack
                            key={index}
                            align="center"
                            w="100%"
                            fontSize={{ base: "md", sm: "lg" }}
                            mb="20px"
                            justify="center" 
                        >
                            <HStack justify="start" gap="5px" align="start">
                                <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                                {item.label} : {item.price}
                                </Text>
                                <MeryTooltip texto={item.tooltip} />
                            </HStack>
                            
                        </VStack>
                    ))}
                    </Flex>}

                    <Box w="100%" borderBottom="2px solid black" my="20px" />
                    {/* <Flex justify="space-between" w="100%" fontSize="xl" fontWeight={"bold"} mb="30px">
                        <Text>TOTAL CARBS </Text>
                        <Text>{recibo.carbs} grams</Text>
                    </Flex>  */}

                    <Flex justify="center" gap="20px" w="100%" fontSize="xl" fontWeight={"bold"} wrap="wrap">
                        <EBookButton texto={'Why I need complex carbs?'}></EBookButton>
                        <EBookButton texto={'Do I need simple carbs?'}></EBookButton>
                        <EBookButton texto={'Why fiber is essential?'}></EBookButton>
                    </Flex>  
                    </div>
                </Flex>} >
            </CustomCard>}


            {user == null && <PurpleSpinner></PurpleSpinner>}
            
        </Flex>
    );

}
