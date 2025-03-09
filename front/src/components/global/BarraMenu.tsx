import React, { useState } from 'react';
import { Box, Input, Text, Flex, Card } from '@chakra-ui/react'; // Chakra UI para estilos
import {
    MdSearch
  } from 'react-icons/md';
import { DiaryIcon } from '../icons/DiaryIcon';
import EBookButton from './random/EBookButton';
import { DesignIcon } from '../icons/DesignIcon';
import { useRouter } from 'next/navigation';


// Componente de búsqueda
function BarraMenu() 
{
  const router = useRouter();
  return (
    <Card
        p={"20px"} 
        width={{ base: "90%", md: "100%" }} 
        mb={"20px"} 
        maxWidth="800px" 
        maxHeight="20px" 
        align="center" 
        justify="center" 
        direction="row"
        cursor="pointer"
        borderRadius={"13px"}
        bg="purple.100"
        border="2px solid white" 
    >
        <Flex
        flex="1"   
        justifyContent="center"
        onClick={()=> router.push("/myday")} 
        alignItems="center"

        >
            <svg xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.1))" }} height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"/></svg>
        </Flex>

        <Flex
        flex="1"   
        justifyContent="center"
        onClick={()=> router.push("/myday")} 
        alignItems="center"

        borderLeft={ "2px solid white"}
        >
          <DiaryIcon></DiaryIcon>
        </Flex>

        <Flex
        flex="1"   
        justifyContent="center"
        onClick={()=> router.push("/addfood/buscarAlimento")} 
        alignItems="center"

        borderLeft={ "2px solid white"}
        >
         <svg xmlns="http://www.w3.org/2000/svg"  style={{ filter: "drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.1))" }} height="30px" viewBox="0 -960 960 960" width="30px" fill="#FFFFFF"><path d="M427-427H180.78v-106H427v-246.22h106V-533h246.22v106H533v246.22H427V-427Z"/></svg>
        </Flex>

        <Flex
        flex="1"   
        justifyContent="center"
        onClick={()=> router.push("/addfood/buscarAlimento")} 
        alignItems="center"
        borderLeft={ "2px solid white"}
        >
         <svg xmlns="http://www.w3.org/2000/svg"  style={{ filter: "drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.1))" }} height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M479.23-185.39q-48.38-35.69-104-55.15Q319.62-260 260-260q-36.61 0-71.92 8.11Q152.77-243.77 120-228q-21.38 9.84-40.69-2.93Q60-243.69 60-267.08v-433.53q0-12.93 6.85-23.89 6.84-10.96 19-15.96 40.61-19.77 84.65-29.65Q214.54-780 260-780q58.38 0 113.69 16.54Q429-746.92 480-716.92v459.38q50.62-32 106.81-47.23Q643-320 700-320q34.46 0 65.11 4.85 30.66 4.84 63.35 15.3 4.23 1.16 7.89.2 3.65-.97 3.65-6.35v-449.23q10.38 3.08 20.27 6.85 9.88 3.77 19.27 9.46 10.23 5 15.34 14.61 5.12 9.62 5.12 20.62v435.84q0 23.39-19.89 35.96-19.88 12.58-42.42 3.12-32.38-15.39-67.11-23.31Q735.85-260 700-260q-60 0-116.38 18.88-56.39 18.89-104.39 55.73ZM560-360v-360l200-200v380L560-360Zm-140 73.46v-394.07q-37.61-18.62-77.92-29.01Q301.77-720 260-720q-37 0-70.27 6.81-33.27 6.81-62.42 18.88-3.08 1.16-5.19 3.27-2.12 2.12-2.12 5.19v381.23q0 5.39 3.65 6.35 3.66.96 7.89-.58 29.61-10.69 61.04-15.92Q224-320 260-320q44.85 0 85.69 9.27 40.85 9.27 74.31 24.19Zm0 0v-394.07 394.07Z"/></svg>
        </Flex>

        <Flex
        flex="1"   
        justifyContent="center"
        onClick={()=> router.push("/addfood/buscarAlimento")} 
        alignItems="center"
        borderLeft={ "2px solid white"}
        >
         <DesignIcon></DesignIcon>
        </Flex>

    </Card>


  );
}

export default BarraMenu;
