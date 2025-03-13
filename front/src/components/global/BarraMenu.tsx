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
             <svg xmlns="http://www.w3.org/2000/svg" height="24px" style={{ filter: "drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.1))" }} viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
        </Flex>

        <Flex
        flex="1"   
        justifyContent="center"
        onClick={()=> router.push("/fidelity")} 
        alignItems="center"
        borderLeft={ "2px solid white"}
        >
         <svg xmlns="http://www.w3.org/2000/svg"  onClick={()=> router.push("/fidelity")} style={{ filter: "drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.1))" }} height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
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
        onClick={()=> router.push("/designMeal/start")} 
        alignItems="center"
        borderLeft={ "2px solid white"}
        >
         <svg xmlns="http://www.w3.org/2000/svg" height="26px" style={{ filter: "drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.1))" }} viewBox="0 -960 960 960" width="26px" fill="#FFFFFF"><path d="m358.15-505.84 88.7-89.31-69.08-69.7-45.16 45.16-42.15-42.15L335-707l-61.54-61.54-89.31 89.31 174 173.39Zm320.7 321.3 89.3-89.31-61.54-61.54-45.15 44.54L619.31-333l44.54-45.15-69.31-68.7-88.7 88.7 173.01 173.61ZM697.46-760l63.16 63.15L697.46-760ZM288.08-140H140v-148.08l175.39-175.38L100-679.23l173.46-173.46 216.77 216.38 164.85-165.46q9.31-9.31 20.46-13.77 11.15-4.46 23.31-4.46 12.15 0 23.3 4.46 11.16 4.46 20.46 13.77l59.16 60.93q9.31 9.3 13.57 20.46 4.27 11.15 4.27 23.3 0 12.16-4.27 22.81-4.26 10.65-13.57 19.96L637.69-489.23l215 215.77L679.23-100 463.46-315.39 288.08-140ZM200-200h62.54l392.38-391.77-63.15-63.15L200-262.54V-200Zm423.85-423.23-32.08-31.69 63.15 63.15-31.07-31.46Z"/></svg></Flex>
 
    </Card>


  );
}

export default BarraMenu;
