'use client';
import { Flex, Box, Text, SimpleGrid, Avatar, HStack, Button, Tooltip, VStack } from '@chakra-ui/react';
import { API_URL, colorNutricionist, colorNutricionistBg, fileToBase64, userNutriId} from '@/GlobalHelper';
import CustomCard from '../global/cards/CustomCard';
import NutriComent from './NutriComent';
import { NutritionistIcon } from '../icons/NutritionistIcon';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { nutriComentarios, nutriPerfil } from '../../../../backend/src/dto/nutri.dto';
import PopUpConfirmationMessage from './PopUpConfirmationMessage';
import { CuteBoxIcon } from '../nutritionist/CuteBoxIcon';

export default function NutritionistClientCard(props:{  }) 
{   
    // 0: nutri normal con sus datos
    // 1: hire one
    // 2: showing list of nutris to add
    // 3: waiting for confirmation
    const [cardType, setcardType] = useState<number>(-1); 

    // hiring a nutritionist
    const [nutris, setnutris] = useState<nutriPerfil[]>(); 
    const [fotosNutris, setfotosNutris] = useState<string[]>();
    const [selectedNutri, setselectedNutri] = useState<nutriPerfil>();

    // waiting for nutritionist confirmation
    const [nutriAsked, setnutriAsked] = useState<nutriPerfil>(); 

    const [myNutri, setmyNutri] = useState<nutriPerfil>(); 
////////////////////////////////////////////////////////////////

    useEffect(() => 
    {
        prepara();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const prepara = async () =>
    {
        let userTieneNutri = await miraSiUserTieneNutri();
        if(userTieneNutri !== null && userTieneNutri !== undefined && userTieneNutri !== false)
        {
            setcardType(0)
            cogeDatosNutri(userTieneNutri)
        }
        else
        {
            clienteEsperaConfirmacionNutri();
        }
    };

    const miraSiUserTieneNutri = async () =>
    {
        try{
                const response = await axios.get(
                `${API_URL}/usuarios/userTieneNutri/${sessionStorage.getItem("userNom")}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
                );
            if(response.data != null && response.data!=0)
            {
                sessionStorage.setItem("userNutri", response.data)
                return response.data;
            }
            else
                return false;
        }
        catch (error) {
            return false;
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => 
    {
        if(cardType == 2)
            cogeTodosNutris();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardType]);

    const cogeTodosNutris = async () =>
    {
        try{
                const response = await axios.get(
                `${API_URL}/nutritionist`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
                );
                console.log(response.data)
            if(response.data.nutris != null)
            {
                setnutris(response.data.nutris)
                let guarda = [];
                for(let i=0; i< response.data.nutris.length; i++)
                {
                    if(response.data.nutris[i].perfilPic != null)
                    {
                        let foto = await fileToBase64(response.data.nutris[i].perfilPic);
                        guarda.push(foto)
                    }
                    else
                        guarda.push("")
                } 
                setfotosNutris(guarda)
            }
        }
        catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    // user could be waiting for the confirmation of a nutri...
    const clienteEsperaConfirmacionNutri = async () =>
    {
        try
        {
            const response = await axios.get(
            `${API_URL}/nutritionist/userHaHechoSolicitud/${sessionStorage.getItem("userNom")}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            );
            if(response.data.nutri[0])
            {
                setnutriAsked(response.data.nutri[0])
                setcardType(3)
            }
            else
                setcardType(1)
        }
        catch (error) {
            console.log('Error fetching data:', error);
            setcardType(1);
        }
    };


    ////// USER HAS NUTRI //////
    // if client has a nutri just show it
    const cogeDatosNutri = async (userNutriId:string) =>
    {
        try
        {
            const response = await axios.get(
            `${API_URL}/nutritionist/nutri/${userNutriId}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            );
            if(response.data.nutri[0])
            {
                if(response.data.nutri[0].perfilPic!= null)
                {
                    let foto = await fileToBase64(response.data.nutri[0].perfilPic);
                    response.data.nutri[0].perfilPic= foto;
                }
                setmyNutri(response.data.nutri[0])
                return true;
            }
            else
                return false;
        }
        catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const despedirNutri = async () =>
    {
        try
        {
            const response = await axios.put(
            `${API_URL}/usuarios/despedirNutri/${sessionStorage.getItem("userNom")}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            );
            if(response.data)
            {
                sessionStorage.removeItem("userNutri")
                setmyNutri(undefined)
                setcardType(1)
            }
        }
        catch (error) {
            console.log('Error fetching data:', error);
        }
    };


    return (
        <>
        {cardType!= -1 && 
        <CustomCard mt="10px" bgColor ={colorNutricionistBg} p ={cardType == 1 ? "10px" : "20px"} hijo={
        <>
            {cardType == 0 && 
            <SimpleGrid columns={{ base: 1 }}>
                {/* datos del nutricionista */}
                <Flex
                    direction="column"
                    alignItems="center"
                    justify="center"
                    w={ "100%" } // En pantallas grandes, ocupa el 20% del contenedor, en pantallas pequeñas ocupa el 100%
                >
                    <HStack>
                        <Box mt="-10px"><NutritionistIcon /></Box>
                        <Text fontStyle="italic" mb={2}>Nutritionist</Text>
                    </HStack>
                    
                    <Avatar mb={2} src={myNutri?.perfilPic} />
                    <Text fontWeight="bold">{myNutri?.nom}</Text>
                </Flex>

                <Flex direction="column" align="center" w="100%" ml= "0px">
                    {/* contact button */}
                    <HStack>
                        <CuteBoxIcon icono={<svg onClick={()=> location.href="../sendMessage"} xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 -960 960 960" fill="#000000">
                            <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
                            </svg>}>
                        </CuteBoxIcon>

                        <Box
                            display="flex"
                            ml="0px"
                            mt="20px"
                            cursor="pointer"
                            alignItems="center"
                            justifyContent="center"
                            borderRadius="50%" // Make the box round
                            borderWidth="3px" // Border thickness
                            borderStyle="solid"
                            onClick={despedirNutri}
                            borderColor={colorNutricionist}
                            w={{ base: "40px", md: "40px" }} // Adjust size for smaller screens
                            h={{ base: "40px", md: "40px" }}
                            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)" // Shadow for depth
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                        </Box>

                    </HStack>
                </Flex>
            </SimpleGrid>}

            {cardType == 1 &&
            <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                
                <Button p="25px" borderRadius={"10px"} onClick={() => setcardType(2)} bg={colorNutricionist}>
                    <HStack >
                        <Box><NutritionistIcon /></Box>
                        <Text>View nutritionists</Text>
                    </HStack>
                </Button>
            </Box>}

            {cardType == 2 && selectedNutri != undefined && <PopUpConfirmationMessage prepara={prepara} selectedNutri={selectedNutri} setselectedNutri={setselectedNutri} />}
            {cardType == 2 && nutris && nutris.length >0 && fotosNutris && fotosNutris.length >0 &&
            <VStack w="100%"  align="center">
                <HStack mb="10px">
                    <Box><NutritionistIcon /></Box>
                    <Text fontWeight={"bold"}>Nutritionists:</Text>
                </HStack>
            
                <VStack 
                w="100%" 
                maxH="150px"   
                overflowY="auto"  
                spacing={1}  
                >
                    {nutris.map((nutri: nutriPerfil, index: number) => (
                        <HStack 
                            key={index} 
                            w="90%"
                            justifyContent="space-between" 
                            p={4} 
                        >
                            <HStack >
                                <Avatar src={fotosNutris[index]} alt={nutri.nom.charAt(0)} size="md"/>
                                <VStack align="start">
                                    <Text fontSize="sm" fontWeight="700">{nutri.nom}</Text>
                                    <Text color="gray.500" fontSize="10px">{nutri.description}</Text>
                                </VStack>
                            </HStack>
            
                            <Tooltip label="Hire as your nutritionist">
                                <Box cursor="pointer" onClick={() => setselectedNutri(nutri)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                                        <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Z"/>
                                    </svg>
                                </Box>
                            </Tooltip>
                        </HStack>
                    ))}
                </VStack>
            </VStack>}
        

            {cardType == 3 && nutriAsked &&
            <HStack>
                <Box><NutritionistIcon /></Box>
                <Text>Waiting for {nutriAsked?.nom} to confirm your hiring request.</Text>
            </HStack>}
        </> 
        }></CustomCard>}
        </>
    );
}