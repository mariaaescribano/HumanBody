'use client';
// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, VStack, Wrap } from '@chakra-ui/react';




export default function FFA(props: { title:string, img: string, texto:string, height:string, img2:string, height2:string}) {

  return (
    <Card
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        w="100%"
        h={{ base: "600px", md: "600px" }}
        borderRadius="30px"
        boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"
        position="relative"
    >
    <Wrap width="100%" mb="30px" spacing="-20px" justify="center">
            <Box
                width="90%"
                height={props.height}
                backgroundImage={`url(${props.img})`}
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                filter="drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.5))"
            />

            <Text
                fontFamily="Times New Roman, serif"
                fontSize="20px"
                fontWeight="bold"
                width="100%"
                mt="20px"
                textAlign="center"
            >
                {props.title}
            </Text>
        </Wrap>


        <Text
            fontFamily="Times New Roman, serif"
            fontSize="16px" 
            textAlign="center"
            mt="-20px"
            p="20px"
            mb="10px"
            whiteSpace="pre-line"
        >   
        {props.texto}
        </Text>
        <Box
                width="80px"
                height={props.height2}
                backgroundImage={`url(${props.img2})`}
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                filter="drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.5))"
            />
    </Card>
  );
}
