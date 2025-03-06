'use client';
import { CarbsName } from '@/components/Names/CarbName';
import { FatsName } from '@/components/Names/FatsName';
import { ProteinsName } from '@/components/Names/ProteinName';
import { Flex, Box, Icon, Text, HStack, Image, VStack, Input } from '@chakra-ui/react';
import { reciboConstNames, reciboSkeleton } from '../../../../../backend/src/dto/recibos.dto';
import { useEffect, useRef } from 'react';
import { esSoloNumeros } from '../../../../GlobalHelper';



export default function MacroNutrCardEdit(props: {recibo:reciboSkeleton, setrecibo:any, totalMacro:string, screenSize:string, infoLista:string[] }) 
{
    // para "dejar" q el recibo se actualice
    // si se actualiza cuando actualizamos los resultados, en hacer suma, seria un bucle continuo
    let entra = useRef<boolean>(false)

   // le pasamos objeto a editar por parametro
   // pone los datos
   const escribir = (item:string, gramosCantidas:string) =>
    {
        if(esSoloNumeros(gramosCantidas) || gramosCantidas=="" )
        {
            entra.current = true;
            if(gramosCantidas=="")
                gramosCantidas="0";

            const nuevoRecibo = { ...props.recibo };

            switch (item) {  // Convertimos a minúsculas para hacer la comparación más robusta
                case reciboConstNames.completo:
                    nuevoRecibo.completo= Math.round(parseInt(gramosCantidas,10)).toString();
                    break;
                case reciboConstNames.incompleto:
                    nuevoRecibo.incompleto= Math.round(parseInt(gramosCantidas,10)).toString();
                    break;
                case reciboConstNames.monoinsaturadas:
                    nuevoRecibo.monoinsaturadas= Math.round(parseInt(gramosCantidas,10)).toString();
                    break;
                case reciboConstNames.poliinsaturadas:
                    nuevoRecibo.poliinsaturadas=Math.round(parseInt(gramosCantidas,10)).toString();
                    break;
                case reciboConstNames.saturadas:
                    nuevoRecibo.saturadas= Math.round(parseInt(gramosCantidas,10)).toString();
                    break;
                case reciboConstNames.fibra:
                    nuevoRecibo.fibra= Math.round(parseInt(gramosCantidas,10)).toString();
                    break;
                case reciboConstNames.complejos:
                    nuevoRecibo.complejos= Math.round(parseInt(gramosCantidas,10)).toString();
                    break;
                case reciboConstNames.simples:
                    nuevoRecibo.simples= Math.round(parseInt(gramosCantidas,10)).toString();
                    break;
                default:
                    console.log("Not found")
            }

            props.setrecibo(nuevoRecibo)
        }
    };

    

   // hacer suma
    useEffect(() => 
    {
        if(props.recibo != null && entra.current == true)
        {
            entra.current = false;
            const nuevoRecibo = { ...props.recibo };

            // resultado de carbs
            let sumaCarbs = (Number(props.recibo.complejos) || 0) + (Number(props.recibo.simples) || 0);
            nuevoRecibo.carbs = Math.round(sumaCarbs).toString();

            // resultado de prote
            let sumaProte = (Number(props.recibo.completo) || 0) + (Number(props.recibo.incompleto) || 0);
            nuevoRecibo.prote = Math.round(sumaProte).toString();
             
            // resultado de grasas   
            let sumaGrasas =  (Number(props.recibo.poliinsaturadas) || 0) +  (Number(props.recibo.monoinsaturadas) || 0) +(Number(props.recibo.saturadas) || 0);
            nuevoRecibo.grasas= Math.round(sumaGrasas).toString();

            props.setrecibo(nuevoRecibo)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.recibo]);



  return (
    <Flex direction="column" w="100%">
        <div>
        {props.totalMacro == reciboConstNames.grasas &&  <HStack><FatsName fontSize="2xl" /> <Text mb="5px" fontSize="2xl" fontWeight={"bold"}>{props.screenSize=="sm" ? "PER 100 G": "PER 100 GRAMS"}</Text></HStack>}
        {props.totalMacro == reciboConstNames.prote && <HStack><ProteinsName fontSize="2xl" /> <Text mb="5px" fontSize="2xl" fontWeight={"bold"}>{props.screenSize=="sm" ? "PER 100 G": "PER 100 GRAMS"}</Text></HStack>}
        {props.totalMacro == reciboConstNames.carbs && <HStack><CarbsName fontSize="2xl" /> <Text mb="5px" fontSize="2xl" fontWeight={"bold"}>{props.screenSize=="sm" ? "PER 100 G": "PER 100 GRAMS"}</Text></HStack>}
        <Box w="100%" borderBottom="2px solid black" my="20px" />
            {props.screenSize!= "" && (props.screenSize == "md" || props.screenSize == "xl") && 
            <Flex direction="column" w="100%" gap="5px">
            {
                props.infoLista.map((item, index) => (
                <Flex
                    key={index}
                    align="center"
                    w="100%"
                    
                    gap="20px"
                    fontSize={{ base: "md", sm: "lg" }} // Cambia el tamaño de la fuente en pantallas pequeñas
                    direction={{ base: "column", sm: "row" }} // En pantallas pequeñas, los elementos se apilan verticalmente, en pantallas grandes horizontalmente
                    justify="center" // Alinea todo a la izquierda
                >
                    <HStack justify="start" gap={{ sm: "2px", md:"5px" }} align="start">
                        <Text flexShrink={0} width={{ base: "100%", sm: "auto" }}>
                            {item +": "}
                        </Text>
                    </HStack>

                    <Text
                        flex="1"
                        mx="8px"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        display={{ base: "none", sm: "block" }} // Oculta la línea punteada en pantallas pequeñas
                    >
                        ........................................................................................................................................................
                    </Text>
                    <Input
                        border="1px solid gray"
                        borderRadius={"10px"}
                        fontWeight='500'
                        variant='main'
                        // value={(props.recibo as any)[item]} 
                        w="20%"
                        onChange={(e:any)=> escribir(item, e?.target.value)}
                        _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
                        h='44px'
                        maxH='44px'
                    />
                     <Text flexShrink={0}>
                            {" grams"} 
                        </Text>
                </Flex>
            ))}
            </Flex>}

            {/* Total small screen */}
            {props.screenSize!= "" && props.screenSize == "sm" && 
            <Flex direction="column" w="100%" mb="10px">
            {
                props.infoLista.map((item, index) => (
                <VStack
                    key={index}
                    align="center"
                    fontSize={{ base: "md", sm: "lg" }}
                    mb="20px"
                    justify="center" 
                >
                    <HStack>
                        <Text flexShrink={0}>
                            {item + ": "} 
                        </Text>
                        <Input
                            
                            border="1px solid gray"
                            borderRadius={"10px"}
                            fontWeight='500'
                            variant='main'
                            onChange={(e:any)=> escribir(item, e?.target.value)}
                            _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
                            h='44px'
                            maxH='44px'
                        />
                        <Text flexShrink={0}>
                            {" grams"} 
                        </Text>
                        {/* <MeryTooltip texto={item.tooltip} /> */}
                    </HStack>
                </VStack>
            ))}
            </Flex>}

            <Box w="100%" borderBottom="2px solid black" my="20px" />
            <Flex justify="space-between" w="100%" fontSize="xl" fontWeight={"bold"} gap="10px">
                <Text>TOTAL </Text>
                 
                {props.totalMacro == "PROTEINS" && <Text>{props.recibo.prote=="" ? 0 : props.recibo.prote+ "    "} grams</Text>}
                {props.totalMacro == "CARBS" && <Text> {props.recibo.carbs=="" ? 0 : props.recibo.carbs + "    "} grams</Text>}
                {props.totalMacro == "FATS" && <Text> {props.recibo.grasas=="" ? 0 : props.recibo.grasas+"    "} grams</Text>}
            </Flex> 
        </div>
    </Flex>

  );
}
