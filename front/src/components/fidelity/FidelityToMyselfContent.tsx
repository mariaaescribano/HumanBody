'use client';
import { Flex, FormLabel, SimpleGrid, Textarea } from '@chakra-ui/react';
import { fidelidadCompleteSkeleton } from '../../../../backend/src/dto/fidelidad.dto';

export default function FidelityToMyselfContent(props:{escribir:any, datos: fidelidadCompleteSkeleton}) 
{
    return (
    <>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="40px">
            <Flex direction='column' mb={'10px'}>
                <FormLabel
                display='flex'
                ms='10px'
                fontSize='sm'
                fontWeight='bold'
                _hover={{ cursor: 'pointer' }}
                >
                Where am I?
                </FormLabel>
                <Textarea
                border="1px solid gray"
                borderRadius={"10px"}
                fontWeight='500'
                onChange={(e) => props.escribir('estoy', e.target.value)}
                variant='main'
                value={props.datos.estoy}
                aria-multiline={true}
                placeholder={"I'm stuck in feeling bad and snacking too much."}
                _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
                h="auto"
                w="100%"
                />
            </Flex>

            <Flex direction='column' mb={'10px'}>
                <FormLabel
                display='flex'
                ms='10px'
                fontSize='sm'
                fontWeight='bold'
                _hover={{ cursor: 'pointer' }}
                >
                Where will I be?
                </FormLabel>

                <Textarea
                border="1px solid gray"
                borderRadius={"10px"}
                fontWeight='500'
                variant='main'
                value={props.datos.estare}
                onChange={(e) => props.escribir('estare', e.target.value)}
                aria-multiline={true}
                placeholder={"I will have ordered meals to give my body what it deserves."}
                _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
                h="auto"
                w="100%"
                // display={{ base: 'block', sm: 'block', md: 'none' }} // Para pantallas pequeñas
                />
            </Flex>

            <Flex direction='column' mb={'10px'}>
                <FormLabel
                display='flex'
                ms='10px'
                fontSize='sm'
                fontWeight='bold'
                _hover={{ cursor: 'pointer' }}
                >
                What is my final objective?
                </FormLabel>

                <Textarea
                border="1px solid gray"
                borderRadius={"10px"}
                fontWeight='500'
                value={props.datos.objetivo}
                variant='main'
                onChange={(e) => props.escribir('objetivo', e.target.value)}
                aria-multiline={true}
                placeholder={"To feel good and full of energy all the time."}
                _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
                h="auto"
                w="100%"
                // display={{ base: 'block', sm: 'block', md: 'none' }} // Para pantallas pequeñas
                />
            </Flex>

            <Flex direction='column' mb={'10px'}>
                <FormLabel
                display='flex'
                ms='10px'
                fontSize='sm'
                fontWeight='bold'
                _hover={{ cursor: 'pointer' }}
                >
                What can I do every day to get there?
                </FormLabel>

                <Textarea
                border="1px solid gray"
                borderRadius={"10px"}
                value={props.datos.acercarme}
                fontWeight='500'
                onChange={(e) => props.escribir('acercarme', e.target.value)}
                variant='main'
                aria-multiline={true}
                placeholder={"Instead of a quick sandwich, eat a salad."}
                _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
                h="auto"
                w="100%"
                // display={{ base: 'block', sm: 'block', md: 'none' }} // Para pantallas pequeñas
                />
            </Flex>

            <Flex direction='column' mb={'20px'}>
                <FormLabel
                display='flex'
                ms='10px'
                fontSize='sm'
                fontWeight='bold'
                _hover={{ cursor: 'pointer' }}
                >
                How do I self-sabotage?
                </FormLabel>

                <Textarea
                border="1px solid gray"
                borderRadius={"10px"}
                fontWeight='500'
                variant='main'
                value={props.datos.autosaboteo}
                onChange={(e) => props.escribir('autosaboteo', e.target.value)}
                aria-multiline={true}
                placeholder={"At night, eating chocolate bars and not preparing lunch in advance."}
                _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
                h="auto"
                w="100%"
                // display={{ base: 'block', sm: 'block', md: 'none' }} // Para pantallas pequeñas
                />
            </Flex>

            <Flex direction='column' mb={'20px'}>
                <FormLabel
                display='flex'
                ms='10px'
                fontSize='sm'
                fontWeight='bold'
                _hover={{ cursor: 'pointer' }}
                >
                How can I trust in myself?
                </FormLabel>

                <Textarea
                border="1px solid gray"
                borderRadius={"10px"}
                fontWeight='500'
                value={props.datos.trustmyself}
                variant='main'
                onChange={(e) => props.escribir('trustmyself', e.target.value)}
                aria-multiline={true}
                placeholder={"Counting calories and meditate every time I want to eat sugar."}
                _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
                h="auto"
                w="100%"
                // display={{ base: 'block', sm: 'block', md: 'none' }} // Para pantallas pequeñas
                />
            </Flex>
        </SimpleGrid>
    </>
    );
}