'use client';
import { Flex, Box, Text, Checkbox, Button, HStack, Spinner, Link, Card } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { fidelidadSkeleton } from '../../../../backend/src/dto/fidelidad.dto';
import { CarbIcono, colorCarbs, colorFats, colorFibra, colorProte, FiberIcono, ProteIcono } from '@/GlobalHelper';
import { FatIcono } from '../icons/FatIcon';
import { alimentoMacroMealView, selectedAlimentosSkeleton } from '../../../../backend/src/dto/meal.dto';

export default function AlimentoMacroMealViewCard(props:{ key:number, macro:number, 
    alimento:alimentoMacroMealView, 
    alimentos:alimentoMacroMealView[], setalimentos:any,
    selectedAlimentos:selectedAlimentosSkeleton, setselectedAlimentos:any,
    setcalories:any
 }) 
{
    const colores = [colorProte, colorFats, colorCarbs, colorFibra];
    const iconos = [ProteIcono, FatIcono, CarbIcono, FiberIcono];
    const Icono = iconos[props.macro] ?? null;
    const [alimentoLocal, setalimentoLocal] = useState<alimentoMacroMealView>();

    const selectedByMacro = {
        0: props.selectedAlimentos.prote,
        1: props.selectedAlimentos.fats,
        2: props.selectedAlimentos.carbs,
        3: props.selectedAlimentos.fiber,
    };
    const selectedAlimentoMacro = selectedByMacro[props.macro];

    // cuando alimento no sea null, se coge y se guarda en variable de aqui
    useEffect(() => {
        if (props.alimento!=null) 
        {
            setalimentoLocal(props.alimento)
        }
    }, [props.alimento]);


    const seleccionaAlimento = () =>
    {
        if(alimentoLocal)
        {
            props.setselectedAlimentos((prev: selectedAlimentosSkeleton) => {
            const updated = { ...prev };
            if (props.macro === 0) {
                updated.prote = alimentoLocal.nombreFuente;
                updated.proteGrams = alimentoLocal.gramosFuente; // Para proteínas
                updated.proteTotal = alimentoLocal.gramosMacro;
            } else if (props.macro === 1) {
                updated.fats = alimentoLocal.nombreFuente;
                updated.fatsGrams = alimentoLocal.gramosFuente; // Para grasas
                updated.fatsTotal = alimentoLocal.gramosMacro;
            } else if (props.macro === 2) {
                updated.carbs = alimentoLocal.nombreFuente;
                updated.carbsGrams = alimentoLocal.gramosFuente; // Para carbohidratos
                updated.carbsTotal = alimentoLocal.gramosMacro;
            } else if (props.macro === 3) {
                updated.fiber = alimentoLocal.nombreFuente;
                updated.fiberGrams = alimentoLocal.gramosFuente; // Para fibra
                updated.fiberTotal = alimentoLocal.gramosMacro;
            }
            return updated;
            });  
            props.setcalories((prev:number)=> prev + Number(alimentoLocal.calorias))
        }
    };

    const borrar = () => 
    {
        // Copiar el estado previo y solo modificar la propiedad que corresponde
        props.setselectedAlimentos((prev: selectedAlimentosSkeleton) => 
        {
            const updated = { ...prev };  // Crear una copia del estado anterior
            if (props.macro === 0) {
                updated.prote = "";
                updated.proteGrams = ""; // Para proteínas
            } else if (props.macro === 1) {
                updated.fats = "";
                updated.fatsGrams = ""; // Para grasas
            } else if (props.macro === 2) {
                updated.carbs = "";
                updated.carbsGrams =""; // Para carbohidratos
            } else if (props.macro === 3) {
                updated.fiber = "";
                updated.fiberGrams ="";// Para fibra
            }
            return updated;  // Retornar el estado actualizado
        });
        props.setcalories((prev:number)=> prev - Number(alimentoLocal.calorias))
    };


    ///////////// EDITANDO VALORES PREDEFINIDOS /////////////
    // si el usuario quiere puede cambiar el num de calorias y por tanto de gramos de macro
    const changeCaloriesMacros = (e:any, decrease:boolean) => 
    {
        e.preventDefault();
        if (alimentoLocal) 
        {
            let caloriasFuenteDecrease = 0;
            if(decrease==true)
                caloriasFuenteDecrease = Math.round(Number(alimentoLocal.calorias) - 10); // Decrecer 1 caloría (o cualquier valor que el usuario elija)
            else
                caloriasFuenteDecrease = Math.round(Number(alimentoLocal.calorias) + 10);

            // Verificamos que no estemos restando más calorías de las que hay
            if (caloriasFuenteDecrease <= 0) return;
    
            // Calculamos los gramos de alimento ajustados proporcionalmente
            const gramosFuenteDecrease = Math.round(
                (caloriasFuenteDecrease / Number(alimentoLocal.calorias)) * Number(alimentoLocal.gramosFuente)
            );
    
            // Calculamos los gramos de macronutrientes ajustados proporcionalmente
            const gramosMacroDecrease = Math.round(
                (caloriasFuenteDecrease / Number(alimentoLocal.calorias)) * Number(alimentoLocal.gramosMacro)
            );

            actualizaListaYAlimentoLocal(caloriasFuenteDecrease.toString(), gramosFuenteDecrease.toString(), gramosMacroDecrease.toString());
        }
    };

    const actualizaListaYAlimentoLocal = (caloriasFuenteDecrease:string, gramosFuenteDecrease:string, gramosMacroDecrease:string) =>
    {
        let alimentoMeal : alimentoMacroMealView = 
        {
            recibo: alimentoLocal?.recibo,
            nombreFuente: alimentoLocal?.nombreFuente,
            gramosMacro: gramosMacroDecrease,
            calorias:caloriasFuenteDecrease,
            gramosFuente:gramosFuenteDecrease
        }
        // Actualizamos el estado con los nuevos valores calculados
        setalimentoLocal( alimentoMeal );

        props.setalimentos(
            props.alimentos.map((item: alimentoMacroMealView) =>
                item.nombreFuente === alimentoMeal.nombreFuente
                    ? { ...item, ...alimentoMeal }  // Reemplaza 
                    : item  // Si no coinciden, mantiene el item tal como está
            )
        );
    };
    ///////////// END EDITANDO VALORES PREDEFINIDOS /////////////
    
    
    return (
        <>
            {alimentoLocal && props.selectedAlimentos && (
                <Card
                    p="10px"
                    cursor={"default"}
                    bg={selectedAlimentoMacro === "" || selectedAlimentoMacro === alimentoLocal.nombreFuente ? colores[props.macro] : "gray.100"}
                    width={{ base: "300px", md: "600px" }}
                    ml={{ base: "-25px", md: "0px" }}
                    align="center"
                    justify="center"
                    borderRadius="25px"
                >
                    <Flex direction="row" width="100%" align="center">
                        {/* Sección izquierda: icono + nombre */}
                        <Flex flex="1" align="center" ml="5px">
                            <Box
                                bg="white"
                                boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
                                p="5px"
                                borderRadius="80px"
                                mr="5px"
                            >
                                {Icono && <Icono />}
                            </Box>
                            <Text color={props.macro == 3 ? "black" : "white"} ml="5px">
                                {alimentoLocal.nombreFuente} : {alimentoLocal.gramosFuente} grams
                            </Text>
                        </Flex>
    
                        {/* Sección centro: calorías */}
                        <Flex flex="0.5" justify="center" align="center">
                            {/* increase */}
                            <Box
                                bg="white"
                                onClick={selectedAlimentoMacro === "" ? (e)=> changeCaloriesMacros(e, false) : () => {}}
                                cursor={selectedAlimentoMacro === "" ? "pointer" : "default"}
                                boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
                                borderRadius="50%"  // Esto hace que el borde sea completamente redondeado
                                width="20px"        // El ancho del círculo
                                height="20px"
                                justifyContent="center"
                                alignItems="center"
                                display="flex"   
                                mr="5px"
                            >
                                +
                            </Box>

                            {/* calories */}
                            <Box
                                bg="white"
                                boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
                                p="5px"
                                borderRadius="20px"
                                mr="5px"
                            >
                                <Text  ml={{ base: "8px", md: "0px" }} color="black">{alimentoLocal.calorias} kcal</Text>
                            </Box>

                            {/* decrease */}
                            <Box
                                bg="white"
                                onClick={selectedAlimentoMacro === "" ? (e)=> changeCaloriesMacros(e, true) : () => {}}
                                cursor={selectedAlimentoMacro === "" ? "pointer" : "default"}
                                boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
                                borderRadius="50%"  // Esto hace que el borde sea completamente redondeado
                                width="20px"        // El ancho del círculo
                                height="20px"
                                justifyContent="center"
                                alignItems="center"
                                display="flex"   
                                mr="5px"
                            >
                                -
                            </Box>
                        </Flex>
    
                        {/* Sección derecha: acciones */}
                        <Flex flex="0.3" justify="flex-end" align="center" mr="5px" >
                            {/* add */}
                            <svg onClick={selectedAlimentoMacro === "" ? seleccionaAlimento : () => {}}
                            cursor={selectedAlimentoMacro === "" ? "pointer" : "default"}
                            fill={selectedAlimentoMacro === alimentoLocal.nombreFuente ? "#A7A6BA" : "white"} 
                            xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px">
                                <path d="M438.09-278.09h83.82v-160h160v-83.82h-160v-160h-83.82v160h-160v83.82h160v160ZM480-71.87q-84.91 0-159.34-32.12-74.44-32.12-129.5-87.17-55.05-55.06-87.17-129.5Q71.87-395.09 71.87-480t32.12-159.34q32.12-74.44 87.17-129.5 55.06-55.05 129.5-87.17 74.43-32.12 159.34-32.12t159.34 32.12q74.44 32.12 129.5 87.17 55.05 55.06 87.17 129.5 32.12 74.43 32.12 159.34t-32.12 159.34q-32.12 74.44-87.17 129.5-55.06 55.05-129.5 87.17Q564.91-71.87 480-71.87Zm0-91q133.04 0 225.09-92.04 92.04-92.05 92.04-225.09 0-133.04-92.04-225.09-92.05-92.04-225.09-92.04-133.04 0-225.09 92.04-92.04 92.05-92.04 225.09 0 133.04 92.04 225.09 92.05 92.04 225.09 92.04ZM480-480Z"/>
                            </svg>
                            
                            {/* borrar */}
                            <Box
                                ml="5px"
                                display="flex"
                                onClick={ selectedAlimentoMacro==alimentoLocal.nombreFuente ? borrar : () => {} }
                                alignItems="center"
                                cursor={selectedAlimentoMacro === alimentoLocal.nombreFuente ? "pointer" : "default"}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="25px"
                                    viewBox="0 -960 960 960"
                                    width="25px"
                                    fill={selectedAlimentoMacro === alimentoLocal.nombreFuente ? "white" : "#A7A6BA"}
                                >
                                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                </svg>
                            </Box>
                        </Flex>
                    </Flex>
                </Card>
            )}
        </>
    );
    


}