


'use client';
import { colorNutricionist } from '@/GlobalHelper';
// Chakra imports
import { Box, Spinner } from '@chakra-ui/react';


export default function GreenSpinner(props: { quieroHeight?:boolean }) {

  return (
    <Box
        height= {props.quieroHeight == null ? "100vh" : "0" }    
        display="flex"
        alignItems="center"   
        justifyContent="center"  
    >
        <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color={colorNutricionist } 
        size="xl"
        />
    </Box>
  );
}
