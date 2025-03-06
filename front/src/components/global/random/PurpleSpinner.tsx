


'use client';
// Chakra imports
import { Box, Spinner } from '@chakra-ui/react';


export default function PurpleSpinner(props: {  }) {

  return (
    <Box
        height="100vh"       
        display="flex"
        alignItems="center"   
        justifyContent="center"  
    >
        <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="purple.200"
        size="xl"
        />
    </Box>
  );
}
