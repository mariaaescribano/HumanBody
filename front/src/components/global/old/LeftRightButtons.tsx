'use client';
// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue, Card, Button, HStack, Image } from '@chakra-ui/react';
import { useState } from 'react';

export default function LeftRightButtons(props: { urlLeft:string, urlRight:string }) {
 
  
  return (
    <>  
        <HStack mt={{base:"20px", md:"120px"}}>
            <Button bg={props.urlLeft == "" ? "gray.200" : "purple.100"} borderRadius="50%"  w="60px" 
            h="60px" color="white" px="20px" py="10px" onClick={()=>{location.href = props.urlLeft}}
            _hover={props.urlLeft != "" ? {
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.5)",  // Sombra más oscura al hacer hover
              transform: "scale(1.05)"  // Le da un pequeño efecto de zoom al hacer hover
            } : ""}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8B7DBE"><path d="m357.31-418.09 210.13 210.7-87.87 87.3-359.48-359.48 360.34-360.34 88.44 87.3-211.56 211.57h482.6v122.95h-482.6Z"/></svg>
            </Button>

            <Button bg={props.urlRight == "" ? "gray.200" : "purple.100"} onClick={()=>{location.href = props.urlRight}}
             borderRadius="50%"  w="60px" h="60px" color="white" px="20px" py="10px"
             _hover={props.urlRight != "" ? {
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.5)",  // Sombra más oscura al hacer hover
              transform: "scale(1.05)"  // Le da un pequeño efecto de zoom al hacer hover
            } : ""}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8B7DBE"><path d="M602.69-418.09h-482.6v-122.95h482.6L391.13-752.61l88.44-87.3 360.34 360.34-359.48 359.48-87.87-87.3 210.13-210.7Z"/></svg>
            </Button>
        </HStack>
    </>
  );
}
