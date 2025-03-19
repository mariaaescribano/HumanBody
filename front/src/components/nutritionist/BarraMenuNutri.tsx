import React from 'react';
import { Flex, Card } from '@chakra-ui/react'; // Chakra UI para estilos
import { useRouter } from 'next/navigation';
import { colorNutricionist } from '@/GlobalHelper';


// Componente de búsqueda
function BarraMenuNutri(props:{rellena?:string} ) 
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
        bg={colorNutricionist}
        border="2px solid white" 
    >
        <Flex
        flex="1"   
        justifyContent="center"
        onClick={()=> router.push("/myday")} 
        alignItems="center"
        >
          {props.rellena != "patients" && <svg onClick={()=> router.push("/nutritionist/myPatients")} style={{ filter: "drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.1))" }} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>} 
          {props.rellena == "patients" && <svg onClick={()=> router.push("/nutritionist/myPatients")} style={{ filter: "drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.1))" }} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Z"/></svg>} 
        </Flex>

        <Flex
        flex="1"   
        justifyContent="center"
        onClick={()=> router.push("/fidelity")} 
        alignItems="center"
        borderLeft={ "2px solid white"}
        >
         {props.rellena != "create" && <svg onClick={()=> router.push("/fidelity")} style={{ filter: "drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.1))" }} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>} 
         {props.rellena == "create" && <svg onClick={()=> router.push("/fidelity")} style={{ filter: "drop-shadow(2px 5px 5px rgba(0, 0, 0, 0.1))" }} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z"/></svg>} 
        </Flex>

        <Flex
        flex="1"   
        justifyContent="center"
        onClick={()=> router.push("/miPerfil")} 
        alignItems="center"
        borderLeft={ "2px solid white"}
        >
          {props.rellena != "perfil" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>} 
          {props.rellena == "perfil" && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg>} 
        </Flex>

    </Card>


  );
}

export default BarraMenuNutri;
