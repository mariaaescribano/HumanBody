'use client';
// Chakra imports
import { Box, Avatar, Icon } from '@chakra-ui/react';

export default function PencilIconOnTop(props: {setEmpezarAEditar:any, editando:boolean, function:any}) {

  return (
        <Box position="relative" display="inline-block">
        
            {/* Box positioned bottom-right */}
            <Box 
                bg="gray.400" 
                borderRadius="20px" 
                p="5px"
                position="absolute"
                bottom="0"
                _hover={{bg:"gray.200"}}
                cursor="pointer"
                onClick={props.editando == false ? ()=> props.setEmpezarAEditar(!props.editando) :
                 ()=> { props.setEmpezarAEditar(!props.editando); props.function(); }   
                }
                right="0"
                transform="translate(30%, 30%)" // Adjust for better positioning
            > 
               {props.editando == false && 
               <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
                >
                <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
                </svg>}

                {props.editando == true && 
               <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>}
            </Box>
        </Box>
    );
}
