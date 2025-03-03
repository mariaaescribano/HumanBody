'use client';
import { Flex, Box, Text, Checkbox } from '@chakra-ui/react';
import InputField from '../global/random/InputField';
import { useEffect, useState } from 'react';
import { fidelidadSkeleton } from '../../../../backend/src/dto/fidelidad.dto';

export default function FidelidadCard(props: { fidelidad: fidelidadSkeleton | null, setfidelidad: any }) {
    const [fid, setFid] = useState<fidelidadSkeleton>({
        heSidoFiel: false,
        porQue: "",
        paraQue: ""
    });

    useEffect(() => {
        if (props.fidelidad) {
            setFid({
                heSidoFiel: props.fidelidad.heSidoFiel,
                porQue: props.fidelidad.porQue,
                paraQue: props.fidelidad.paraQue
            });
        } else {
            setFid({
                heSidoFiel: false,
                porQue: "",
                paraQue: ""
            });
        }
    }, [props.fidelidad]);

    const cambia = (texto: string, num: number) => {
        setFid((prev) => ({
            ...prev,
            porQue: num === 1 ? texto : prev.porQue,
            paraQue: num === 2 ? texto : prev.paraQue
        }));
    };

    const handleCheckboxChange = () => {
        setFid((prev) => {
            const updated = { ...prev, heSidoFiel: !prev.heSidoFiel };
            props.setfidelidad(updated);
            return updated;
        });
    };

    return (
        <Flex direction="column" w="100%">
            <Text mb="5px" fontWeight="bold" fontSize="25px">FIDELITY TO MYSELF</Text>
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
                onBlur={() => props.setfidelidad(fid)}
            />

            <InputField
                mb="20px"
                textAlign="center"
                value={fid.paraQue}
                onChange={(e: any) => cambia(e.target.value, 2)}
                id="second"
                label="For what have I been loyal?"
                placeholder="For getting closer to my best version"
                onBlur={() => props.setfidelidad(fid)}
            />
        </Flex>
    );
}