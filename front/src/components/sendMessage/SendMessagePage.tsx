'use client';
// Chakra imports
import {
    Avatar,
  Box,
  Button,
  Card,
  Flex,
  Input,
  HStack,
  IconButton,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import CustomCard from '@/components/global/cards/CustomCard';
import { API_URL, colorNutricionist, fileToBase64, getDatosNutri} from '../../GlobalHelper';
import BarraMenu from '../global/BarraMenu';
import BarraMenuNutri from '../nutritionist/BarraMenuNutri';
import Message from './Message';
import {messageSkeleton} from '../../../../backend/src/dto/message.dto';

export default function SendMessagePage(props: { 
    idNutri:string;
    userNom:string;
    nutri:boolean;
    cargado:boolean;
    diaId:string;
}) {
  
    const [dataOtherPerson, setdataOtherPerson ] = useState<{nom:string, pic:string}>();
    const [pastMessages, setpastMessages ] = useState<messageSkeleton[]>([]);

    // sending message
    // 0: no, 1: yes (message is "" or is been posted)
    const [disabled, setdisabled ] = useState<number>(1); 
    const [message, setmessage ] = useState<string>(""); // currently writing
    const inputWriteMessage = useRef(null);



    // 0: take the data from the other person to see it in the screen
    useEffect(() => 
    {
        if(props.nutri!= null && props.idNutri && props.userNom)
        {
            // we will take the data from the other person (to show in the title)
            if(props.nutri == true)
            {
                cogeDatosPatient()
            }
            else
            {
                cogeDatosNutri()
            }
        };
    }, [props.nutri, props.idNutri, props.userNom]);

    const cogeDatosNutri = async () =>
    {
        try
        {
            const response = await axios.get(
            `${API_URL}/nutritionist/nutri/${props.idNutri}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            );
            if(response.data.nutri[0])
            {
                if(response.data.nutri[0].perfilPic!= null)
                {
                    let foto = await fileToBase64(response.data.nutri[0].perfilPic);
                    response.data.nutri[0].perfilPic= foto;
                }
                setdataOtherPerson({nom:response.data.nutri[0].nom, pic:response.data.nutri[0].perfilPic})
            }
        }
        catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const cogeDatosPatient = async () =>
    {
        try
        {
            const response = await axios.get(
            `${API_URL}/usuarios/getUserFoto/${props.userNom}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            );

            if(response.data[0].perfilPic!= null)
            {
                let foto = await fileToBase64(response.data[0].perfilPic);
                setdataOtherPerson({nom:props.userNom, pic:foto?.toString()})
            }
        }
        catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    // 1: get the past messages //////////////////////////////////////////////////////


    // 2: post a message //////////////////////////////////////////////////////
    // only if message != "" can be send
    const writeMessage = (e:any) =>
    {
        let value = e.target.value;
        setmessage(e.target.value)
        if(value == "")
            setdisabled(1)
        else
            setdisabled(0)
    };

    // if message has been correctly uploaded, then the message is created in the web
    const postMessage = async () =>
    {
        setdisabled(2)
        let body: messageSkeleton =
        {
            userNom: props.userNom,
            nutriId: Number(props.idNutri),
            diaId: Number(props.diaId),
            sendBy: props.nutri == true ? 1 : 0, // 0:patient, 1: nutri
            message: message,
            foto:"", 
            vistoPorLaOtraPersona: 0
        };

        try
        {
            const response = await axios.post(
            `${API_URL}/messages/create`,
            body,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            );
            if(response.data=="ok")
            {
                setdisabled(3)

                // we add the new message to the list of pastmessages
                setpastMessages((prevMessages:messageSkeleton[]) => [...prevMessages, body]);
                setmessage("")
                inputWriteMessage.current.focus()
                const timer = setTimeout(() => {
                    setdisabled(1)
                }, 3000);
                return () => clearTimeout(timer); 
            }
        }
        catch (error) 
        {
            console.log('Error al enviar mensaje desde paciente a nutricionista:', error);
            setdisabled(4)
            setmessage("")
            inputWriteMessage.current.focus()
            const timer = setTimeout(() => {
                setdisabled(1)
            }, 3000);
            return () => clearTimeout(timer);
        }
    };

 




  return (
    <Flex
        direction="column"
        align="center"
        bg={props.nutri == true ? colorNutricionist : "purple.100"}
        w="100%"
        h="100%"
        justify="center"
        p="20px"
        minH="100vh"
        position={"relative"}
    >
        {props.nutri==false && <BarraMenu></BarraMenu>}
        {props.nutri==true && <BarraMenuNutri></BarraMenuNutri>}

        {/* title */}
        <CustomCard mt="0px" p="15px" hijo={
            <HStack>
                <Avatar src={dataOtherPerson?.pic} size="md"/>
                <VStack mt="-25px">
                    <Text color={"black"} fontSize="sd" h="10px" >
                        {props.nutri == true ? "Your patient:" : "Your nutri:"}
                    </Text>
                    <Text color={"black"} fontSize="xl" h="10px" fontWeight="bold" mt="5px">
                        {dataOtherPerson?.nom}
                    </Text>
                </VStack>
            </HStack>
        }></CustomCard>

        {/* past messages */}
        <Flex 
            direction="column" 
            flex="1" 
            maxWidth="500px" 
            w="100%"
            maxH={{ base: "520px", md: "450px" }}
            overflowY="auto"
            p="10px"
            margin="auto"  
            alignItems="center"  
            justifyContent="center"  
        >
            {pastMessages.map((item, index) => (
                <Message key={index} object={item}/>
            ))}
        </Flex>

        {/* input */}
        <CustomCard mt="20px" p="30px" hijo={
            <Flex 
                position="absolute" 
                bottom="0" 
                width="100%" 
                direction="row"
                p="10px" 
            >
                <Input textAlign="center" ref={inputWriteMessage} value={message} onChange={(e) => writeMessage(e)}
                focusBorderColor={props.nutri == true ? colorNutricionist : "purple.100"} 
                style={{ width: "100%", borderRadius:"20px", marginTop:"10px" }} />
                <Box marginTop={"12px"} ml="10px" mr="5px">
                    <HStack>
                        <svg xmlns="http://www.w3.org/2000/svg" cursor="pointer" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>
                        
                        
                        {/* icono enviar */}
                        
                        {(disabled == 0 || disabled == 1) && <svg xmlns="http://www.w3.org/2000/svg" cursor={disabled == 0 ? "pointer" : "default"} onClick={disabled == 0 ? postMessage : undefined} height="30px" 
                        viewBox="0 -960 960 960" width="30px" fill={disabled == 0 ? "#000000" : "#CFCFCF"}><path d="M480-440 160-640v400h360v80H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v280h-80v-200L480-440Zm0-80 320-200H160l320 200ZM760-40l-56-56 63-64H600v-80h167l-64-64 57-56 160 160L760-40ZM160-640v440-240 3-283 80Z"/></svg>}
                        {disabled==2 &&
                        <Spinner
                            size="sm"
                            ml={4}
                            color="black"
                        />}
                        {disabled==3 && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#78A75A"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>}
                        {disabled==4 && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#BB271A"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>}
                    </HStack>
                </Box>
            </Flex>
        }></CustomCard>
        
    </Flex>);
}
