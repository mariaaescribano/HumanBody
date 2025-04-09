'use client';
// Chakra Imports
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Icon, useColorMode } from '@chakra-ui/react';

export default function SuccessErrorMessage(props: {title: string, status:string, height?:string}) {

  return (
    <Box my={4}>
        <Alert
        status={props.status == "success" ? 'success': 'error'}
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height={props.height ? props.height : { base: "50px", md: '100px' }}
        borderRadius='10px'
        w={props.height ? props.height : { base: "50px", md: '150px' }}
        >
        <AlertIcon boxSize='25px' mr={0} />

        {props.title && <AlertTitle mt={4} mb={1} fontSize='md' display={{ base: "none", md: "block" }}>
            {props.title}
        </AlertTitle>}

        {/* {props.description && <AlertDescription maxWidth='sm' mt="10px" whiteSpace="pre-line" >
            {props.description}
        </AlertDescription>} */}
        
        </Alert>
    </Box>
  );
}
