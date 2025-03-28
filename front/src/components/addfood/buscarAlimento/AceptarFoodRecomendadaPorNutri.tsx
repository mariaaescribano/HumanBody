'use client';
import { CarbsName } from '@/components/Names/CarbName';
import { FatsName } from '@/components/Names/FatsName';
import { ProteinsName } from '@/components/Names/ProteinName';
import { Flex, Box, Icon, Text, HStack, Image, VStack, Input, SimpleGrid, FormLabel, useColorModeValue, Card } from '@chakra-ui/react';
import { reciboConstNames, reciboSkeleton } from '../../../../../backend/src/dto/recibos.dto';
import { useEffect, useRef, useState } from 'react';
import { API_URL, colorNutricionist, esSoloNumeros } from '../../../GlobalHelper';
import InputField from '@/components/global/random/InputField';
import { CaloryIcon } from '@/components/icons/CaloryIcon';
import CustomCard from '@/components/global/cards/CustomCard';
import axios from 'axios';
import { alimentosComidosSkeleton } from '../../../../../backend/src/dto/alimentos.dto';
import AlimentoMiniJustRead from '../AlimentosCard/AlimentoMiniJustRead';
import { NutritionistIcon } from '@/components/icons/NutritionistIcon';
import AlimentoMiniAcceptReject from '../AlimentosCard/AlimentoMiniAcceptReject';



export default function AceptarFoodRecomendadaPorNutri() 
{
    // STRATEGY
    // take all foods recomended, show them one by one, ask the user if wants to accept it
    // accept: will be sum to their calories(...)
    // reject: will be deleted from bd

    const [alimentosLista, setalimentosLista] = useState<alimentosComidosSkeleton[]>([]);


    useEffect(() => 
    {
        getNutriComentario()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getNutriComentario = async () =>
    {
        try{
            const response = await axios.get(
            `${API_URL}/nutricomentarios/${sessionStorage.getItem("userNom")}/${sessionStorage.getItem("userNutri")}`, 
            {
                headers: 
                {
                    'Content-Type': 'application/json'
                },
            });
            if(response.data)
            {
                setalimentosLista(response.data)
            }
        }
        catch (error) {
            console.log('Error fetching data:', error);
        }
    };





    return (
    <>
    {alimentosLista && alimentosLista.length > 0 && <Card mt="40px" mb="-30px" height="200px" p="20px" overflowY="scroll" bgColor={colorNutricionist} w="100%" borderRadius="15px">
        <HStack>
            <NutritionistIcon></NutritionistIcon>
            <Text fontWeight="bold">Food recommended</Text>
        </HStack>
        
        
        {alimentosLista.map((alimento, index) => (
        <AlimentoMiniAcceptReject key={index} alimentoComido={alimento[0]} function={getNutriComentario}></AlimentoMiniAcceptReject>
        ))}
    </Card>}
    </>
    );
}
