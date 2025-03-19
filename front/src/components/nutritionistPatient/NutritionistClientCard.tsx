'use client';
import { Flex, Box, Text, SimpleGrid, Avatar, HStack } from '@chakra-ui/react';
import { colorNutricionist, colorNutricionistBg} from '@/GlobalHelper';
import CustomCard from '../global/cards/CustomCard';
import NutriComent from './NutriComent';
import { NutritionistIcon } from '../icons/NutritionistIcon';

export default function NutritionistClientCard(props:{ userNom:any }) 
{
    return (
        <CustomCard mt="10px" bgColor ={colorNutricionistBg} hijo={
            <SimpleGrid columns={{ base: 1 }} spacing="20px">
                {/* datos del nutricionista */}
                <Flex
                    direction="column"
                    alignItems="center"
                    justify="center"
                    w={ "100%" } // En pantallas grandes, ocupa el 20% del contenedor, en pantallas pequeñas ocupa el 100%
                >
                    <HStack>
                        <Box mt="-10px"><NutritionistIcon /></Box>
                        <Text fontStyle="italic" mb={2}>Nutricionist</Text>
                    </HStack>
                    
                    <Avatar mb={2} />
                    <Text fontWeight="bold">Name</Text>
                </Flex>

                <Flex direction={{ base: "column", md: "row"}} align="center" w="100%" ml={{ base: "0px", md: "60px"}}>
                    {/* comentario que te ha hecho */}
                    <NutriComent text={'Remember to enjoy the process and know that you deserve to be your best version, no matter the cost. You are worthy of self-love and self-care.'} />

                    {/* contact button */}
                    <Box
                        display="flex"
                        ml={{ base: "0px", md: "20px" }}
                        mt={{ base: "20px", md: "0px" }}
                        cursor="pointer"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="50%" // Make the box round
                        borderWidth="3px" // Border thickness
                        borderStyle="solid"
                        borderColor={colorNutricionist}
                        w={{ base: "40px", md: "40px" }} // Adjust size for smaller screens
                        h={{ base: "60px", md: "40px" }}
                        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)" // Shadow for depth
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 -960 960 960" fill="#000000">
                            <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
                        </svg>
                    </Box>
                </Flex>
            </SimpleGrid>
        }></CustomCard>
    );
}