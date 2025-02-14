
'use client';
// Chakra imports
import { Alert, AlertIcon, AlertDescription, CloseButton, AlertTitle } from '@chakra-ui/react';


export default function PopUpMessage(props: { cancel:boolean, setCancel:React.Dispatch<React.SetStateAction<boolean>>, title:string, texto:string, }) 
{

    return (
        <Alert
            status="error"
            variant="solid"
            justifyContent="center"
            borderRadius="8px"
            flexDirection="column"
            alignItems="center"

        >
            <AlertIcon />
            <AlertTitle mr="12px" justifySelf="center">
                {props.title}
            </AlertTitle>
            <AlertDescription>{props.texto}</AlertDescription>
            {/* <CloseButton
                onClick={()=> props.setCancel(!props.cancel)}
                bg="red.200"
                mt="10px"
                fontSize={{ sm: '8px', md: '12px' }}
                right={{ sm: '-4px', md: '8px' }}
                top={{ sm: '-4px', md: '8px' }}
            /> */}
        </Alert>);

};
