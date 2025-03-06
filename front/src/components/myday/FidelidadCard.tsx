'use client';
import { Flex, Box, Text, Checkbox, Button, HStack } from '@chakra-ui/react';
import InputField from '../global/random/InputField';
import { useEffect, useState } from 'react';
import { fidelidadSkeleton } from '../../../../backend/src/dto/fidelidad.dto';
import axios from 'axios';
import { API_URL } from '../../../GlobalHelper';
import SuccessErrorMessage from '../global/message/SuccessErrorMessage';

export default function FidelidadCard() 
{
    const [fid, setFid] = useState<fidelidadSkeleton | null>(null);
    const [respuesta, setrespuesta] = useState<boolean | undefined>(undefined);

    // 0: mira si en BD ya hay datos de fidelidad
    useEffect(() => 
    {
        const traeDatosFidelidad = async () =>
        {
            let idDia = sessionStorage.getItem("diaId")
            if(idDia)
            {
            try{
                const response = await axios.get(
                `${API_URL}/fidelidad/dameFidelidad/${idDia}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
                );
                if(response.data)
                {
                    setFid({   
                        heSidoFiel:response.data[0].loHaSido == 0 ? false : true,
                        porQue:response.data[0].why,
                        paraQue:response.data[0].forWhat
                    })
                } 
                else
                {
                    setFid({   
                        heSidoFiel: false,
                        porQue: "",
                        paraQue: ""
                    })
                }
            }
            catch (error) {
            console.error('Error fetching data:', error);
            }
            }
            
        };
        traeDatosFidelidad();   
    }, []);

    const cambia = (texto: string, num: number) => {
        if (fid !== null) {
            setFid((prev:any) => ({ // es any pero deberia de ser fidelidadSkeleton
                ...prev,
                porQue: num === 1 ? texto : prev?.porQue,
                paraQue: num === 2 ? texto : prev?.paraQue
            }));
        }
    };

    const handleCheckboxChange = () => {
        setFid((prev: fidelidadSkeleton | null) => {
            if (prev === null) {
                return { heSidoFiel: false, porQue: "", paraQue: "" }; 
            }
            return {
                ...prev,
                heSidoFiel: !prev.heSidoFiel
            };
        });
    };
    

    // 2: cuando se le da a enviar..
    const actualizaFidelidad = async () =>
    {
        let idDia = sessionStorage.getItem("diaId");
        if(idDia)
        {
            try
            {
                const response = await axios.put(
                    `${API_URL}/fidelidad/updateDiaFidelidad/${idDia}`,
                    fid ,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                );
                if(response.data.message == "ok")
                {
                    setrespuesta(true)
                }
                else
                    setrespuesta(false)   
            }
            
            catch (error) 
            {
                setrespuesta(false)  
                console.log('Error fetching data:', error);
            }
        }
    };

    // eliminar respuesta de success o error
    useEffect(() => 
    {
        if(respuesta != undefined)
        {
            const timer = setTimeout(() => 
            {
               setrespuesta(undefined)
            }, 2000);
            return () => clearTimeout(timer); 
        }
    }, [respuesta]); 


    return (
        <>
            {fid != null && <Flex direction="column" w="100%">
                <Box display="flex" justifyContent="space-between" mb="-5px" alignItems="center" p={4} borderRadius="md">
                    <Text  fontWeight="bold" fontSize="25px">
                        FIDELITY TO MYSELF
                    </Text>

                    <HStack>
                        {respuesta != undefined &&  <Box position="absolute" top="0" ml={{base:"0px", md: "-180px"}} zIndex="10" w="20%">
                        <SuccessErrorMessage status={'success'} title={'Fidelity updated!'} />
                    </Box>} 
                        <Button
                        fontSize="sm"
                        borderRadius="16px"
                        bg="purple.100"
                        w={{sd:"70%", md: "70%"}}
                        h="90%"
                        p="10px"
                        onClick={actualizaFidelidad} 
                        _hover={{bg:"gray.100"}}
                        > SAVE
                        </Button>
                    </HStack>
                </Box>
                <Box w="100%" borderBottom="2px solid black" my="20px" />

                <Box display="flex" justifyContent="center" alignItems="center" mt="10px" mb="20px">
                    <Checkbox colorScheme="purple" isChecked={fid.heSidoFiel} onChange={handleCheckboxChange}>
                        Have I been loyal?
                    </Checkbox>
                </Box>

                <InputField
                    mb="20px"
                    onChange={(e: any) => cambia(e.target.value, 1)}
                    id="first"
                    value={fid.porQue}
                    textAlign="center"
                    label="Why have I been loyal?"
                    placeholder="Because I want to feel better with my brain"
                />

                <InputField
                    mb="20px"
                    textAlign="center"
                    value={fid.paraQue}
                    onChange={(e: any) => cambia(e.target.value, 2)}
                    id="second"
                    label="For what have I been loyal?"
                    placeholder="For getting closer to my best version"
                />
            </Flex>}
        </>
    );
}