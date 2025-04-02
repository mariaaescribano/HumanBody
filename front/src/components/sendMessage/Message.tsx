'use client';
import { Box, Flex, HStack, Input, Spinner, Text, VStack } from '@chakra-ui/react';
import { API_URL, colorNutricionist, colorNutricionistBg} from '@/GlobalHelper';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CustomCard from '../global/cards/CustomCard';
import { messageSkeleton } from '../../../../backend/src/dto/message.dto';

export default function Message(props: {object: messageSkeleton})
{
    const [comentario, setcomentario] = useState<string|null>(null);
    const [pulsado, setpulsado] = useState<number>(0);

    return (
        <CustomCard mt="0px" p="20px" hijo={<>
            {props.object.foto != "" && <HStack>
                <img src="/fire.png" alt="icon" width="40px" height="40px" />
                <Text>{props.object.message}</Text>
            </HStack>}
            {props.object.foto == "" && <Text>{props.object.message}</Text>}
            </>
        }></CustomCard>
    );
}