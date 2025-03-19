'use client';
import { Flex, Text } from '@chakra-ui/react';
import { colorNutricionist} from '@/GlobalHelper';

export default function NutriComent(props:{ text:string, mt?:string }) 
{
    return (
        <Flex
            direction="column"
            mt={props.mt ? props.mt : "0px" }
            bg={colorNutricionist}
            p={"10px"}
            w={"80%"} // En pantallas grandes, ocupa el 80% del contenedor
            h="fit-content"
            alignSelf={"center"}
            alignItems="center" // Center horizontally
            justify="center"    // Center vertically
            borderRadius="20px"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            maxW="100%"
            maxH="600px"
        >
            <Text
                textAlign="center" 
                fontSize="sm"
                wordBreak="break-word"
                overflowWrap="break-word"
                whiteSpace="normal"
            >
                { props.text }
            </Text>
        </Flex>
    );
}