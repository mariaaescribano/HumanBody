'use client';
// Chakra imports
import {
    Avatar,
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components

import React, { useEffect, useRef, useState } from 'react';
import { API_URL, cogePacientesDeNutri, colorNutricionist, dameNutriNom, fileToBase64, redirigirSiNoHayNutriNom, StringIsNull, tryAgain } from '../../../../GlobalHelper';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';
import InputField from '@/components/global/random/InputField';
import BarraMenuNutri from '@/components/nutritionist/BarraMenuNutri';
import CustomCard from '@/components/global/cards/CustomCard';
import GreenSpinner from '@/components/global/random/GreenSpinner';
import { CuteBoxIcon } from '@/components/nutritionist/CuteBoxIcon';
import RecommendCard from '@/components/addfood/verAlimento/RecommendCard';
import { patientSkeleton } from '../../../../../../backend/src/dto/nutri.dto';


export default function MyPatients() 
{
    const [disable, setdisable] = useState<boolean>(false);
    // es any pero en vd es: fichaSkeleton y usuarioSkeleton
    const [patients, setpatients] = useState<patientSkeleton[] | null | []>(null);
    // requests
    const [patientsRequests, setpatientsRequests] = useState<any>(null);
    const [patientsRequestsPics, setpatientsRequestsPics] = useState<any>([]);
    const errorText = useRef<string>("");

    // 0: si no hay nombre de nutri vuelve a inicio
    useEffect(() => 
    {
        redirigirSiNoHayNutriNom();
        cogePacientes();
        cogePacientesSolicitudes();
    }, []);

    // 1: coge todos los pacientes
    const cogePacientes = async () =>
    {
        let nutriNom = dameNutriNom();
        let pacientes = await cogePacientesDeNutri(nutriNom)
        if(pacientes)
        {
            setpatients(pacientes)
        }
    };

    // 2: coge todas las solicitudes de pacientes
    const cogePacientesSolicitudes = async () =>
    {
        let nutriNom = dameNutriNom();
        try{
        const response = await axios.get(
            `${API_URL}/nutritionist/solicitudesDeContrato/${nutriNom}`,
            {
            headers: {
                'Content-Type': 'application/json'
            },
            }
        );
            if(response.data != null)
            {
               
                setpatientsRequests(response.data)

                // get patients pics
                let guarda = [];
                for(let i=0; i< response.data.length; i++)
                {
                    if(response.data[i].perfilPic != null)
                    {
                        let foto = await fileToBase64(response.data[i].perfilPic);
                        guarda.push(foto)
                    }
                    else
                        guarda.push("")
                } 
                setpatientsRequestsPics(guarda)
            }    
            else
                setpatientsRequests([])   
        }
        catch (error) {
        console.error('Error fetching data:', error);
        }
    };

   

    // #region hiring
    // IN CASE OF HAVING REQUESTS CAN ACCEPT OR REJECT THEM //
    const acceptDeleteRequest = async (userNom:string, accept:boolean) =>
    {
        setdisable(true)
        try{
        const response = await axios.put(
            `${API_URL}/nutritionist/nutriAcceptRequest/${sessionStorage.getItem("nutriId")}/${userNom}/${accept}`,
            {
            headers: {
                'Content-Type': 'application/json'
            },
            }
        );
            if(response.data != null)
            {
                cogePacientes();
                cogePacientesSolicitudes();
            }      
        }
        catch (error) {
        console.error('Error fetching data:', error);
        }
        finally {
            setdisable(false);
        }
    };






    
// #region return
  return (
    <>
        {patients != null && patientsRequests!= null &&
        <Flex
            direction="column"
            align="center"
            bg={colorNutricionist}
            w="100%"
            h="100%"
            justify="center"
            minH="100vh"
            position={"relative"}
        >
        <BarraMenuNutri rellena={"patients"} />

        {/* title */}
        <CustomCard mt="0px" p="20px" hijo={
            <HStack>
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Z"/></svg>
                <Text fontSize="xl" fontWeight={"bold"}>MY PATIENTS</Text>
            </HStack>
        }></CustomCard>


        {/* pacientes */} 
        {patients.length > 0 &&<CustomCard mt="10px" p="20px" hijo={
        <>
            <RecommendCard patients={patients} recommending={false} />
        </>
        }></CustomCard>}
        {patients.length == 0 &&<CustomCard mt="10px" p="20px" hijo={
            <Text color="red">You don't have any patients</Text>
        }></CustomCard>}


        {/* solicitudes de pacientes */} 
        <CustomCard mt="10px" p="20px" hijo={
        <>
            <Text fontSize="lg" fontWeight={"bold"} mb="20px">Hiring requests</Text>
            {patientsRequests.length > 0 &&
            patientsRequests.map((patient: any, index: number) => {
            return (
                <Flex key={index} w="100%" justifyContent="space-between" alignItems="center">
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                        <HStack spacing="10px" ml="5%">
                            <Avatar src={patientsRequestsPics[index]} size="md"/>
                            <Text ml={2}>{patient.nombre}</Text>
                        </HStack>

                        <HStack>
                            <CuteBoxIcon mt="0px" icono={<svg onClick={disable == false ? () => acceptDeleteRequest(patient.nombre, true) : () =>{} } xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>}>
                            </CuteBoxIcon>

                            <CuteBoxIcon mt="0px" icono={<svg onClick={disable == false ? () => acceptDeleteRequest(patient.nombre, false): () =>{}} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                            }></CuteBoxIcon>
                        </HStack>
                    </Box>
                </Flex>
            );
            })}
            {patientsRequests.length == 0 &&<Text color="red">You don't have any hiring requests</Text>}
        </>
        }></CustomCard>



        </Flex>}
        {patients == null && <GreenSpinner></GreenSpinner>}
    </>);

}
