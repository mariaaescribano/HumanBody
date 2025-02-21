'use client';
// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image, VStack } from '@chakra-ui/react';
import { useState } from 'react';

export default function PopUpMessage(props: { title:string, texto:string, but1:string, color:string, colorBut:string, url1:string, url2:string }) 
{

    return (
        <>
          <Box
            position="fixed"
            top="0"
            left="0"
            width="100%"
            height="100%"
            backgroundColor="rgba(0, 0, 0, 0.5)"
            display="flex"
            justifyContent="center"
            alignItems="center"
            zIndex="1000"
          >
            <Box
              backgroundColor={props.color}
              padding="20px"
              borderRadius="20px"
              boxShadow="0 2px 10px rgba(0, 0, 0, 0.3)"
              textAlign="center"
            justifyContent="center"
            alignItems="center"
              maxWidth="350px"
              width="100%"
            >
            <VStack spacing={4}>
                <HStack>
                    <Text as="h2" color="black" fontSize="26px" fontWeight="bold">
                        {props.title}
                    </Text>
                </HStack>
                    
                <Text color="black">
                    {props.texto}
                </Text>

                <HStack gap="10px">

                    <Button variant="brand" onClick={()=> {location.href = props.url1} } borderRadius="20px" 
                    fontFamily="Times New Roman, serif" bg = {props.colorBut}
                    _hover={{bg:"gray.200"}}>
                        {props.but1}
                    </Button>

                    {/* <Button variant="brand" onClick={()=> {location.href = props.url1} } borderRadius="20px" 
                    bg="purple.100" fontFamily="Times New Roman, serif"
                    _hover={{
                        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.5)",  // Sombra más oscura al hacer hover
                        transform: "scale(1.05)"  // Le da un pequeño efecto de zoom al hacer hover
                        }}>
                        {props.but1}
                    </Button> */}

                </HStack>


            </VStack>
        </Box>
    </Box>
    </>);



    // const close = () => {
   
    // };
    
    // const goHome = () => 
    // {
    //     location.href = "../inicio/main";
    // };

    // return (
    //     <>
    //       <Box
    //         position="fixed"
    //         top="0"
    //         left="0"
    //         width="100%"
    //         height="100%"
    //         backgroundColor="rgba(0, 0, 0, 0.5)"
    //         display="flex"
    //         justifyContent="center"
    //         alignItems="center"
    //         zIndex="1000"
    //       >
    //         <Box
    //           backgroundColor="white"
    //           padding="20px"
    //           borderRadius="20px"
    //           boxShadow="0 2px 10px rgba(0, 0, 0, 0.3)"
    //           textAlign="center"
    //         justifyContent="center"
    //         alignItems="center"
    //           maxWidth="350px"
    //           width="100%"
    //         >
    //         <VStack spacing={4}>
    //             <HStack>
    //                 <Text as="h2" color="black" fontSize="26px" fontWeight="bold">
    //                     {props.title}
    //                 </Text>
    //             </HStack>
                    
    //             <Text color="black">
    //                 {props.texto}
    //             </Text>

    //             <HStack gap="10px">

    //                 <Button variant="brand" onClick={()=> {location.href = props.url1} } borderRadius="20px" 
    //                 bg="purple.100" fontFamily="Times New Roman, serif"
    //                 _hover={{
    //                     boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.5)",  // Sombra más oscura al hacer hover
    //                     transform: "scale(1.05)"  // Le da un pequeño efecto de zoom al hacer hover
    //                     }}>
    //                     {props.but1}
    //                 </Button>

    //                 {props.but2 != "" && <Button variant="brand" onClick={()=> {location.href = props.url2} } borderRadius="20px" 
    //                 bg="purple.100" fontFamily="Times New Roman, serif"
    //                 _hover={{
    //                     boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.5)",  // Sombra más oscura al hacer hover
    //                     transform: "scale(1.05)"  // Le da un pequeño efecto de zoom al hacer hover
    //                     }}>
    //                     {props.but2}
    //                 </Button>}

    //                 <Button variant="brand" onClick={goHome} borderRadius="20px" 
    //                 bg="purple.100" fontFamily="Times New Roman, serif" 
    //                 _hover={{
    //                     boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.5)",  // Sombra más oscura al hacer hover
    //                     transform: "scale(1.05)"  // Le da un pequeño efecto de zoom al hacer hover
    //                     }}>
    //                     Exit
    //                 </Button>

    //             </HStack>


    //         </VStack>
    //     </Box>
    // </Box>
    // </>);
};
