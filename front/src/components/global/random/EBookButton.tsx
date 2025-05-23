'use client'
// Chakra imports
import { Button, Flex, FormLabel, Icon, Input, Text, useColorModeValue } from '@chakra-ui/react';
import { MdBook, MdBookOnline, MdOutlineBook } from 'react-icons/md';
// Custom components

export default function EBookButton(props: {texto:string, type:number}) {


    return (
        <Button
            fontSize="sm"
            borderRadius="16px"
            bg="#D8F3F8"
            w="100%"
            onClick={() => {
                window.location.href = `${window.location.origin}/ebook?type=${props.type}`;
            }}
            padding="8px 16px" // Asegura espacio interno para el texto
            // minW="fit-content" // Ajusta el ancho al contenido mínimo requerido
            h="fit-content"
            _hover={{ bg: "gray.100" }}
            leftIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480.72-146.37q-48.24-37.76-104.24-59.6-56-21.83-116.48-21.83-41.18 0-80.9 11-39.71 11-76.23 30.52-24.35 12.67-47.32-1.16-22.96-13.83-22.96-40.34V-709.3q0-14.35 6.81-27.13 6.82-12.77 20.45-19.16 46.48-23.76 96.72-35.4 50.23-11.64 102.69-11.64 58.5 0 114.24 15 55.74 15 106.5 45.72v491.89q51-32 107-48.6t113-16.6q36 0 70.5 6.36T840-290.5v-489.57q15.48 5 30.7 10.86 15.21 5.86 29.93 13.62 13.87 5.96 20.33 18.97 6.45 13.01 6.45 27.32v485.1q0 25.64-22.84 38.23-22.85 12.6-47.44-.31-36.52-19.52-76.23-30.52-39.72-11-80.9-11-60 0-115.64 21.95-55.64 21.96-103.64 59.48ZM560-353.78v-388.13l200-201.68v407.89L560-353.78Zm-167.41 61.41v-395.76q-31.33-13.28-64.8-20.19-33.46-6.9-67.79-6.9-37 0-72 6.7t-68 20.11v398.43q35-13 69.5-19.12 34.5-6.12 70.5-6.12 34.33 0 67.03 5.4 32.71 5.41 65.56 17.45Zm0 0v-396 396Z"/></svg>}
        >
            {props.texto}
        </Button>
    );
}
