'use client';
import { Flex, Box, Icon, Text, HStack, Image, VStack, Input, SimpleGrid, FormLabel, useColorModeValue, Avatar, Spinner } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { API_URL, cogePacientesDeNutri, dameNutriNom, esSoloNumeros } from '../../../GlobalHelper';
import axios from 'axios';
import { patientSkeleton } from '../../../../../backend/src/dto/nutri.dto';
import { CuteBoxIcon } from '@/components/nutritionist/CuteBoxIcon';
import SuccessErrorMessage from '@/components/global/message/SuccessErrorMessage';



export default function RecommendCard(props: { patients:patientSkeleton[] | [], recommending:boolean, 
    setpatientElegido?:any, patientElegido?:patientSkeleton, recommended?:boolean }) 
{
    return (
        <>
        {props.recommending == true && 
        <>
        <Text fontSize="md" fontWeight="bold" mb="10px">Recommending to...</Text>
        {props.recommended == true && <SuccessErrorMessage status={'success'} title={'Food recommended!'}></SuccessErrorMessage>}
        </>}
        
        { props.patients && props.patients.map((patient: any, index: number) => {
        return (
            <Flex key={index} w="100%" justifyContent="space-between" alignItems="center">
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <HStack spacing="10px" ml="5%">
                        <Avatar src={patient.perfilPic} size="md"/>
                        <Text ml={2}>{patient.nombre}</Text>
                    </HStack>
                    
                    {props.recommending == false && 
                    <HStack>
                        <CuteBoxIcon mt="0px" icono={<svg cursor="pointer" 
                        onClick={()=> {sessionStorage.setItem("patientTratando",patient.nombre); location.href=`./perfil`;}} 
                        xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg>}>
                        </CuteBoxIcon>

                        <CuteBoxIcon mt="0px" icono={<svg cursor="pointer" xmlns="http://www.w3.org/2000/svg" 
                        onClick={()=> {sessionStorage.setItem("patientTratando",patient.nombre); location.href=`./mypatientday`;}} 
                        height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Z"/></svg>
                        }></CuteBoxIcon>

                        <CuteBoxIcon messagesWithoutRead={patient.messagesNotRead} mt="0px" icono={<svg cursor="pointer" xmlns="http://www.w3.org/2000/svg" 
                        onClick={()=> {sessionStorage.setItem("patientTratando",patient.nombre); location.href=`./sendMessage`;}} 
                        height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>}>
                        </CuteBoxIcon>
                    </HStack>}

                    {props.recommending == true && 
                    <HStack mr="20px">
                        <CuteBoxIcon mt="0px"
                        icono={props.patientElegido == null ? 
                        <svg onClick={()=> {props.setpatientElegido(patient)}} 
                        xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-440 160-640v400h360v80H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v280h-80v-200L480-440Zm0-80 320-200H160l320 200ZM760-40l-56-56 63-64H600v-80h167l-64-64 57-56 160 160L760-40ZM160-640v440-240 3-283 80Z"/></svg>
                        : props.patientElegido.nombre == patient.nombre ? 
                            <Spinner
                            size="sm"
                            color="black"
                            /> : null}>
                        </CuteBoxIcon>
                    </HStack>}
                </Box>
            </Flex>
        );
        })}
        </>
    );
}
