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
  Tooltip,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import CustomCard from '@/components/global/cards/CustomCard';
import { API_URL, colorNutricionist, fileToBase64, formatDateToISOFriendly, getCurrentTime, getDatosNutri, getFecha} from '../../GlobalHelper';
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
    setcargado:any;
}) {
  
    const [dataOtherPerson, setdataOtherPerson ] = useState<{nom:string, pic:string}>();
    const [pastMessages, setpastMessages ] = useState<messageSkeleton[]>([]);
    const checkBlueInNewMessages = useRef<boolean>(false); // to know if the blue check have already been put
    const fecha = useRef<string>(undefined);

    const [messageDefault, setmessageDefault] = useState<boolean>(false);

    // uploading photo
    // 0: normal, 1:has photo, 2: spinner
    const [pressPhotoBtn, setpressPhotoBtn ] = useState<number>(0); 
    const [photo, setPhoto] = useState<string>("");
    const photoFile = useRef<File>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // sending message
    // 0: no disabled, 1: yes disabled(message is "" or is been posted), 2: spinner, 3: correct, 4:error
    const [disabled, setdisabled ] = useState<number>(1); 
    const [message, setmessage ] = useState<string>(""); // currently writing
    const inputWriteMessage = useRef(null);



    // 0: take the data from the other person to see it in the screen
    useEffect(() => 
    {
        if(props.nutri!= null && props.idNutri && props.userNom && props.diaId!= "")
        {
            // we will take the data from the other person (to show in the title)
            if(props.nutri == true)
            {
                cogeDatosPatient()
            }
            else
            {
                const queryParams = new URLSearchParams(location.search);
                const mira = queryParams.get('mira') || '';
                if(mira)
                {
                    setdisabled(0)
                    setpressPhotoBtn(1)
                    setmessageDefault(true);
                    setmessage("Hey, look my Design A Day :D ")
                }
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
    useEffect(() => 
    {
        if(dataOtherPerson!= undefined)
        {
            recuperatePastMessages()
        }
    }, [dataOtherPerson]);

    const recuperateMessageFotoByIdText = async (idMessage:string) =>
    {
        try
        {
            const response = await axios.get(
            `${API_URL}/messages/messageFoto/${idMessage}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            );
            if(response.data)
            {
                return response.data
            }
        }
        catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const recuperatePastMessages = async () =>
    {
        fecha.current = await getFecha(); 
        fecha.current = formatDateToISOFriendly(fecha.current)
        try
        {
            const response = await axios.get(
            `${API_URL}/messages/${props.diaId}/${props.idNutri}/${props.userNom}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            );
            if(response.data)
            {
                for (let i = 0; i < response.data.length; i++) 
                {
                    if(response.data[i].foto == "1")
                    {
                        let fotoBase64 = await recuperateMessageFotoByIdText(response.data[i].id)
                        if(fotoBase64!= "")
                            response.data[i].foto = (`data:image/jpeg;base64,${fotoBase64}`);
                    }
                    else
                        response.data[i].foto = "" 
                }
                setpastMessages(response.data) 
                props.setcargado(true)
            }
        }
        catch (error) {
            console.log('Error fetching data:', error);
        }
    };
    //////////////////////////////////////////////////////


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
            foto:photo, 
            vistoPorLaOtraPersona: 0,
            hora: await getCurrentTime(),
            designameal: messageDefault == true ? 1 : 0 
        };

        const formData = new FormData();
        formData.append("userNom", props.userNom);
        formData.append("nutriId", String(props.idNutri));
        formData.append("diaId", String(props.diaId));
        formData.append("sendBy", props.nutri ? "1" : "0");
        formData.append("message", message);
        formData.append("foto", photoFile.current == undefined ? "0": "1"); 
        formData.append("fotoFile", photoFile.current); // Send file, not Base64
        formData.append("vistoPorLaOtraPersona", "0");
        formData.append("hora", body.hora);
        formData.append("designameal", body.designameal ? body.designameal : 0);

        try
        {
            const response = await axios.post(
                `${API_URL}/messages/create`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if(response.data=="ok")
            {
                setdisabled(3)

                // we add the new message to the list of pastmessages
                setpastMessages((prevMessages:messageSkeleton[]) => [...prevMessages, body]);
                setmessage("")
                setpressPhotoBtn(0)
                setPhoto("")
                if(messageDefault == true)
                {
                    window.history.pushState({}, '', '../sendMessage');
                }
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
            inputWriteMessage.current.focus()
            const timer = setTimeout(() => {
                setdisabled(1)
            }, 3000);
            return () => clearTimeout(timer);
        }
    };


    // upload photo //////////////////////////////////////////////////////
    const handleOpenFileExplorer = () => {
        if(fileInputRef.current)
            fileInputRef.current.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) 
        {
            setpressPhotoBtn(2)
            const file = files[0];
            photoFile.current = file;
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                setPhoto(imageUrl);
                setpressPhotoBtn(1)
            };
            reader.readAsDataURL(file);
        }
    };

    const deletePhoto = () => {
        setPhoto("");
        setpressPhotoBtn(0)
    };
    // end upload photo //////////////////////////////////////////////////////


    // scroll until the last message //////////////////////////////////////////////////////
    const lastMessageRef = useRef(null);

    useEffect(() => {
        // if there are messages without blue tick, now they will be
        if(pastMessages.length>0 && checkBlueInNewMessages.current==false)
            putBlueCheckOnMessages();

        if (lastMessageRef.current) 
        {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [pastMessages]);
    //////////////////////////////////////////////////////


    // put blue tick //////////////////////////////////////////////////////
    const putBlueCheckOnMessages = async () => {
        // if I'm nutri, the message must be sent by 0 (patient)
        // go one by one changing the messages
        const updatePromises = pastMessages.map((message) => {
            if (props.nutri === true) {
            if (message.sendBy === 0 && message.vistoPorLaOtraPersona === 0 && message.id) {
                message.vistoPorLaOtraPersona = 1;
                return updateMessageCheck(message.id);
            }
            } else {
            if (message.sendBy === 1 && message.vistoPorLaOtraPersona === 0 && message.id) {
                message.vistoPorLaOtraPersona = 1;
                return updateMessageCheck(message.id);
            }
            }
            return null;
        }).filter(promise => promise !== null);
        
        // Wait for all update requests to complete
        await Promise.all(updatePromises);
        
        setpastMessages([...pastMessages]);  // use a new reference to trigger re-render
        checkBlueInNewMessages.current=true;
        };
        
        const updateMessageCheck = async (idMessage: number | undefined) => {
        try {
            const response = await axios.put(
            `${API_URL}/messages/changeToBlueTick/${idMessage}`,
            {},
            {
                headers: {
                'Content-Type': 'application/json',
                },
            }
            );
        
            // Check the response for success (adjust based on your API's response structure)
            if (response.status === 200 && response.data?.message === 'ok') {
            console.log(`Message ${idMessage} updated successfully`);
            } else {
            console.log(`Failed to update message ${idMessage}`);
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };
        
    //////////////////////////////////////////////////////


  return (<>
    {props.cargado == true && props.diaId !== "" && 
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

        <CustomCard mt="0px" p="10px" hijo={
            <Text color={"black"} fontSize="sd" h="10px" mb="10px">
                {fecha.current + " chat"}
            </Text>
        }></CustomCard>

        {/* title */}
        <CustomCard mt="5px" p="15px" hijo={
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
            maxWidth="430px" 
            w="90%"
            maxH={{ base: "430px", md: "420px" }}
            overflowY="auto"
            p="10px"
            margin={{ base: "10px", md: "0px" }} 
            alignItems="center"
            ml={{ base: "50px", md: "50px" }} 
        >
            <div 
                style={{ 
                    overflowY: "auto", 
                    maxHeight: "430px", 
                    width: "100%",
                    paddingRight: "15px"
                }}
            >
                {pastMessages.map((item, index) => (
                    <Message 
                        key={index} 
                        diaId={props.diaId} 
                        object={item} 
                        nutri={props.nutri} 
                        ref={index === pastMessages.length - 1 ? lastMessageRef : null} 
                    />
                ))}
            </div>
        </Flex>


        {/* input */}
        <CustomCard mt="20px" p={photo != "" ? "40px" : "30px"} hijo={
            <Flex 
                position="absolute" 
                bottom="0" 
                width="100%" 
                direction="row"
                p= {photo != "" ? "15px" : "10px"}
            >   
                {photo!= "" && 
                <Flex direction="row">
                    <img src={photo} alt="icon" width="50px" height="40px" />
                    <Box mt="30px" boxSize={"5px"} cursor="pointer" onClick={deletePhoto}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#BB271A"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </Box>
                </Flex>}

                {/* send default message to see design a meal */}
                <Input textAlign="center" ml="20px" ref={inputWriteMessage} 
                value={message} onChange={(e) => writeMessage(e)}
                focusBorderColor={props.nutri == true ? colorNutricionist : "purple.100"} 
                style={{ width: "100%", borderRadius:"20px", marginTop:"10px" }} 
                />
            
                
                <Box marginTop={"12px"} ml="10px" mr="5px">
                    <HStack>
                        {/* icono subir foto */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }} // Oculta el input de tipo "file"
                            onChange={handleFileChange}
                        />
                        {(pressPhotoBtn == 0 || pressPhotoBtn == 1) && <svg xmlns="http://www.w3.org/2000/svg" fill={pressPhotoBtn == 0 ? "#000000" : "#CFCFCF"} onClick={pressPhotoBtn == 0 ? handleOpenFileExplorer : undefined} cursor={pressPhotoBtn == 0 ? "pointer" : "default"} height="30px" viewBox="0 -960 960 960" width="30px"><path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>}
                        {pressPhotoBtn==2 &&
                            <Spinner
                                size="sm"
                                // ml={4}
                                color="black"
                            />}


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
        
    </Flex>}
    

    {props.cargado == true && props.diaId == "" && 
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
        {props.nutri==true && <BarraMenuNutri></BarraMenuNutri>}
        <CustomCard mt="5px" p="15px" hijo={
            <Text color="red">Your patient doesn't have "Today" created, so can't receive messages</Text>
        }></CustomCard>
    </Flex>}

    </>);
}
