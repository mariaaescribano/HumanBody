'use client';
import { Flex, HStack, Input, Spinner, Text } from '@chakra-ui/react';
import { API_URL, colorNutricionist, colorNutricionistBg} from '@/GlobalHelper';
import axios from 'axios';
import { nutriComentarios } from '../../../../backend/src/dto/nutri.dto';
import { useEffect, useState } from 'react';

export default function NutriComent({ 
    campo,
    mt 
  }: { 
    campo: nutriComentarios;
    mt?: string; 
  })
{
    const [comentario, setcomentario] = useState<string|null>(null);
    const [pulsado, setpulsado] = useState<number>(0);

    // salvar cuando el nutri haga un cambio
    const nutriComentario = async () =>
    {
        setpulsado(1)
        try{
            let url ="";
            // se diferencia entre nutri y user por los campos q tienen en ss
            if(sessionStorage.getItem("patientTratando"))
                url=`${API_URL}/nutricomentarios/${campo}/${sessionStorage.getItem("patientTratando")}/${sessionStorage.getItem("nutriId")}`;
            else
                url= `${API_URL}/nutricomentarios/${campo}/${sessionStorage.getItem("userNom")}/${sessionStorage.getItem("userNutri")}`
            
            const response = await axios.put(url,
            JSON.stringify({ comentario }),
            {
                headers: 
                {
                    'Content-Type': 'application/json'
                },
            }
            );
            if(response.data)
            {
                setpulsado(2)
            }
            else
                setpulsado(0)   
        }
        catch (error) {
            setpulsado(0)   
            console.log('Error fetching data:', error);
        }
    };

    // when campo changes, quickly a bd call is made to get the past comment
    useEffect(() => 
    {
        const getNutriComentario = async () =>
        {
            try{
                let url ="";
                if(sessionStorage.getItem("patientTratando"))
                    url=`${API_URL}/nutricomentarios/${campo}/${sessionStorage.getItem("patientTratando")}/${sessionStorage.getItem("nutriId")}`;
                else
                    url= `${API_URL}/nutricomentarios/${campo}/${sessionStorage.getItem("userNom")}/${sessionStorage.getItem("userNutri")}`
            

                const response = await axios.get(
                url, 
                {
                    headers: 
                    {
                        'Content-Type': 'application/json'
                    },
                }
                );
                if(response.data[campo])
                {
                    setcomentario(response.data[campo])
                }
                else
                    setcomentario("")
            }
            catch (error) {
                console.log('Error fetching data:', error);
            }
        };
        if(campo)
            getNutriComentario()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campo]);


    useEffect(() => 
    {
        if(pulsado == 2)
        {
            const timer = setTimeout(() => 
            {
                setpulsado(0)
            }, 2000);
            return () => clearTimeout(timer);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pulsado]);


    return (
        <>
        {/* solo si el comentario no es null, se muestra */}
            {comentario && <Flex
                direction="column"
                mt={mt ? mt : "0px" }
                bg={colorNutricionist}
                p={"10px"}
                w={"80%"} // En pantallas grandes, ocupa el 80% del contenedor
                h="fit-content"
                alignSelf={"center"}
                alignItems="center" // Center horizontally
                justify="center"    // Center vertically
                borderRadius="20px"
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                maxW="100%"
                maxH="600px"
            >
                {/* es el paciente viendo el comentario */}
                {sessionStorage.getItem("userNutri") && 
                <Text
                    textAlign="center" 
                    fontSize="sm"
                    wordBreak="break-word"
                    overflowWrap="break-word"
                    whiteSpace="normal"
                >
                    { comentario }
                </Text>}

                {/* es el nutricionista escribiendo el comentario */}
                {sessionStorage.getItem("nutriNom") &&
                <HStack w="100%">
                    <Input
                        onChange={(e)=> setcomentario(e.target.value)}
                        defaultValue={comentario!= "" ? comentario:undefined}
                        focusBorderColor={ colorNutricionistBg }
                        placeholder={ "Write a comment" }
                    />
                    {pulsado == 0 && <svg onClick={nutriComentario} cursor="pointer" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-440 160-640v400h360v80H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v280h-80v-200L480-440Zm0-80 320-200H160l320 200ZM760-40l-56-56 63-64H600v-80h167l-64-64 57-56 160 160L760-40ZM160-640v440-240 3-283 80Z"/></svg>}
                    {pulsado == 1 && 
                    <Spinner
                        size="sm"
                        ml={2}
                        color="black"
                        />}
                    {pulsado == 2 && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>}
                </HStack>}
            </Flex>}
        </>
    );
}