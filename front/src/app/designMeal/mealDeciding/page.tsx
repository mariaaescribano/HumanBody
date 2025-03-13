'use client';
// Chakra imports
import {
    Box,
  Button,
  Card,
  Flex,
  FormLabel,
  HStack,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  VStack,

} from '@chakra-ui/react';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import CustomCard from '@/components/global/cards/CustomCard';
import BarraMenu from '@/components/global/BarraMenu';
import TitleCard from '@/components/global/cards/TitleCard';
import MainCards from '@/components/designMeal/MainCards';
import BtnsMacrosFila from '@/components/designMeal/BtnsMacrosFila';
import { API_URL, ArrayIsNull, ArrayIsNullEmpty, dameDatosDelRecibo, redirigirSiNoHayUserNom, toRoman } from '@/GlobalHelper';
import { alimentoMacroMealView, mealSkeleton, selectedAlimentosSkeleton } from '../../../../../backend/src/dto/meal.dto';
import { alimentosSkeleton } from '../../../../../backend/src/dto/alimentos.dto';
import { CaloryIcon } from '@/components/icons/CaloryIcon';
import axios from 'axios';
import { reciboSkeleton } from '../../../../../backend/src/dto/recibos.dto';
import AlimentoMacroMealViewCard from '@/components/designMeal/AlimentoMacroMealViewCard';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import EBookButton from '@/components/global/random/EBookButton';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';

export default function DesignMeal_MealDeciding() 
{
  // ESTRATEGIA
  // coger en q meal estamos y mostrarlo
  // los botones de alimentos aparecen todos iluminados conforme los rellenas, se van apagando
  // datos de ss
  // muestra alimentos de fav (solo) y da una aproximacion
  // llamada a bd
  // antes de mostrar cada boton hay q calcular el num de macro q lleva
  // cuando selecciones uno, debe de iluminarse y poner en gris a los demas y al bn add, iluminando tb la papelera

  // abajo del todo q salga un card con los botones de ebooks de por q necesitas cada cosa
  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  // ALIMENTOS LISTAS
  const [alimentosProte, setalimentosProte] = useState<alimentoMacroMealView[] | null>(null);
  const [alimentosFats, setalimentosFats] = useState<alimentoMacroMealView[] | null>(null);
  const [alimentosCarbs, setalimentosCarbs] = useState<alimentoMacroMealView[] | null>(null);
  const [alimentosFiber, setalimentosFiber] = useState<alimentoMacroMealView[] | null>(null);

  const [mensajeError, setmensajeError] = useState<string>("");
  const [calories, setcalories] = useState<number>(0);
  const [meal, setmeal] = useState<mealSkeleton>();
  const [macroViendo, setmacroViendo] = useState<number>(-1); // q macro estamos rellenando ahora
  const mealIndex = useRef<number>(-1);
  const [textoRemember, setTextoRemember] = useState<string>("");
  const [salveDisabled, setsalveDisabled] = useState<boolean>(true);// hasta q no esten todos datos rellenos, se desactiva
  const [selectedAlimentos, setselectedAlimentos] = useState<selectedAlimentosSkeleton>(
    {prote:"",
    fats:"",
    carbs:"",
    fiber:"",
    proteGrams:"",
    fatsGrams:"",
    carbsGrams:"",
    fiberGrams:"",
    proteTotal:"",
    fatsTotal:"",
    carbsTotal:"",
    fiberTotal:""}); // para saber alimentos q seleccionas de cada macro


  // IMPLEMENTACION

  // 0: comprueba q le haya venido el num de mealIndex por param, si no vuelve a main
  useEffect(() => 
  {
    redirigirSiNoHayUserNom()
    // coge numero de meal q lleva
    const queryParams = new URLSearchParams(location.search);
    const mealIndexParam = queryParams.get('mealIndex') || '';
    if(!mealIndexParam)
      location.href = "./main"
    else
    {
      mealIndex.current = Number(mealIndexParam);
      gestionaDatosSS()
    }
  }, []);

  // 1: si todo esta bien, coge y guarda los datos del arrayMeals[mealIndex] 
  // posible error: arrayMeals el objeto del index ya tenga datos --> volver a main
  const gestionaDatosSS = async () =>
  {
    const datosGuardados = sessionStorage.getItem('arrayMeals');
    if(datosGuardados!= undefined)
    {
      const arrayRecuperado = JSON.parse(datosGuardados);
      // posible error aqui
      let indexRellenoEnArray = compruebaindexRellenoEnArray(arrayRecuperado);
      if(indexRellenoEnArray)
        backToMain()
      else
      {
        setmeal(arrayRecuperado[mealIndex.current])
      }
    }
    else
      backToMain()
   
  };

  const compruebaindexRellenoEnArray = (arrayRecuperado: mealSkeleton[]) =>
  {
    if(arrayRecuperado[mealIndex.current].relleno == true)
      return true;
    else
      return false;
  };

  useEffect(() => 
  {
    if(meal)
      traeMacroAlimentosFav();
  }, [meal]);


  // 2: hacemos 4 listas de alimentos favs de user
  const traeMacroAlimentosFav = async () => {
    try {
      let userNom = sessionStorage.getItem("userNom");
      if (userNom) {
        // Iteramos a través de los índices 0 a 3
        for (let i = 0; i < 4; i++) {
          const response = await axios.get(
            `${API_URL}/alimentos/favAlimentos/${userNom}/${i}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
  
          if (response.data) {
            let alimentos = await gestionaResponseAlimentos(response.data, i);
  
            // Aun si alimentos es una cadena vacía, asignamos el valor
            if (!ArrayIsNull(alimentos)) {
              if (i === 0) setalimentosProte(alimentos);
              if (i === 1) setalimentosFats(alimentos);
              if (i === 2) setalimentosCarbs(alimentos);
              if (i === 3) setalimentosProte(alimentos);
            } else {
              throw { message: '406', status: 406 };  // Lanza un error con código 406
            }
          } else {
            throw { message: '406', status: 406 };  // Lanza un error con código 406
          }
        }
        setmacroViendo(0); // Una vez completado el proceso, cambiamos el estado
      } else {
        throw { message: '406', status: 406 };  // Error si no hay usuario
      }
    } catch (error: any) {
      if (error.message === '406') {
        backToMain();
      } else if (error.response?.status === 400) {
        console.log("Solicitud al backend mal formada.");
      } 
      else if (error.response?.status === 404) {
        setmensajeError("Please, select foods as favourite to can Design a Meal");
      } else {
        console.log(error);
        setmensajeError("Please, try again later");
      }
    }
  };
  


  // 3: repasamos uno a uno los alimentos
  // por cada alimento, tenemos q traer su recibo
  const gestionaResponseAlimentos = async (alimentosResponse: alimentosSkeleton[], index:number) =>
  {
    let guardaAlimObjetos = []
    for(let i=0; i< alimentosResponse.length; i++)
    {
      let traeReciboAlimento = await dameDatosDelRecibo(alimentosResponse[i].recibo_id)
      if(traeReciboAlimento)
      {
        let calcula = await calculaMacroFuenteGramos(traeReciboAlimento, index, alimentosResponse[i].calorias_100gr)
        if(calcula && calcula.length > 0 )
        {
          let alimentoMeal : alimentoMacroMealView = 
          {
            recibo: traeReciboAlimento,
            nombreFuente:alimentosResponse[i].nombre,
            gramosMacro: calcula[2].toString(),
            calorias:calcula[1].toString(),
            gramosFuente:calcula[0].toString()
          }
          guardaAlimObjetos.push(alimentoMeal)
        }
        else
          backToMain()
      }
      else
        backToMain()
    } 
    if(guardaAlimObjetos)
      return guardaAlimObjetos 
  };

  //////////////////////////////////// parte 3 helpers /////////////////////////////////////////////////
  // por cada alimento, tenemos q hacer el calculo de macro y gramos
  // --> su usu necesita 50gr de prote, calculamos cuantos gramos hace falta de ese alimento para cubrirlo
  const calculaMacroFuenteGramos = (traeReciboAlimento: reciboSkeleton, index:number, calorias:string) =>
  {
    // mira macro en el q estamos && mira lo q necesita de ese macro
    let necesitoMacro= Number(dameNecesitoSegunMacro(index))
    let macroPor100g = Number(por100gMacro(traeReciboAlimento, index))
    const caloriasPor100g = Number(calorias); // calorías por cada 100g de alimento
    
    // gramos necesarios para obtener necesitoProte
    // Si A → B  traeReciboAlimento.prote -> 100gr
    // C → X (¿cuánto vale X?) necesitoProte -> xgr
    const gramosFuenteNecesito = Math.round((100 * necesitoMacro) / macroPor100g);
  
    // calorías para esa cantidad de gramos
    // Si A → B 100gr -> calorias 
    // C → X gramosFuenteNecesito -> x calorias
    const caloriesTotales = Math.round((caloriasPor100g * gramosFuenteNecesito) / 100);
  
    return [gramosFuenteNecesito, caloriesTotales, necesitoMacro];
  };
  

  const dameNecesitoSegunMacro = (index:number) =>
  {
    if(index== 0)
      return meal?.proteTotal;
    else if(index==1)
      return meal?.fatTotal
    else if(index==2)
      return meal?.carbsTotal
    else if(index==3)
      return meal?.fibraTotal
  };

  const por100gMacro = (traeReciboAlimento:reciboSkeleton, index:number) =>
  {
    if(index== 0)
      return traeReciboAlimento.prote;
    else if(index==1)
      return traeReciboAlimento.grasas;
    else if(index==2)
      return traeReciboAlimento.carbs;
    else if(index==3)
      return traeReciboAlimento.fibra;
  };
  /////////////////////////////////////////////////////////////////////////////////////

  
  



  // 5: SALVAR
  // cada macro y fuente debe de ser llenada en SS
  const salvaSeleccionado = async () =>
  {
    try
    {
      // encontrar en ss el meal y sustituirlo
      const datosGuardados = sessionStorage.getItem('arrayMeals');
      if(datosGuardados)
      {
        const arrayRecuperado = JSON.parse(datosGuardados);
        arrayRecuperado[mealIndex.current] = 
        {
          relleno: true,
          caloriasTotal: meal?.caloriasTotal,
          proteTotal: selectedAlimentos.proteTotal,
          fuenteProte: selectedAlimentos.prote,
          carbsTotal: selectedAlimentos.carbsTotal,
          fuenteCarbs: selectedAlimentos.carbs,
          fatTotal: selectedAlimentos.fatsTotal,
          fuenteFat: selectedAlimentos.fats,
          fibraTotal: selectedAlimentos.fatsTotal,
          fuenteFibra: selectedAlimentos.fiber,
          gramosFuenteProte: selectedAlimentos.proteGrams,
          gramosFuenteCarbs: selectedAlimentos.carbsGrams,
          gramosFuenteFat: selectedAlimentos.fatsGrams,
          gramosFuenteFibra: selectedAlimentos.fiberGrams,
          caloriasSelected: calories
        };
        
        sessionStorage.setItem('arrayMeals', JSON.stringify(arrayRecuperado));
        location.href = './main'
      }
      else
        throw new Error;
    }
    catch(error)
    {
      //setMensajeError(true)
    }
  };




  // cuando el usu haya seleccionado al menos 1 alimento, ya lo puede salvar
  useEffect(() => {
    if (selectedAlimentos.prote != "" || selectedAlimentos.carbs != ""|| selectedAlimentos.fats != ""|| selectedAlimentos.fiber != "") 
    {
      setsalveDisabled(false)
    }
  }, [selectedAlimentos]);

  // cada vez q cambie el macroViendo, tenemos q actualizar la frase q le sale como recordatorio
  useEffect(() => {
    if (macroViendo !== -1 && meal) 
    {
      if (macroViendo === 0)
        setTextoRemember(`You can find ${meal.proteTotal} grams of PROTEINS here:`);
      else if (macroViendo === 1)
        setTextoRemember(`You can find ${meal.fatTotal} grams of FATS here:`);
      else if (macroViendo === 2)
        setTextoRemember(`You can find ${meal.carbsTotal} grams of CARBS here:`);
      else if (macroViendo === 3)
        setTextoRemember(`You can find ${meal.fibraTotal} grams of FIBER here:`);
    }
  }, [macroViendo, meal]);

  const backToMain = () =>
  {
    location.href = "./main"
  };



  useEffect(() => {
    // Configura un temporizador cuando breakTry cambia
    const timer = setTimeout(() => {
        if (mensajeError!="") 
        {
          sessionStorage.removeItem("arrayMeals")
          sessionStorage.removeItem("meals")
          location.href = "../../myday"
        }
    }, 3000);
    
    // Limpieza de temporizadores al desmontar o cambiar breakTry
    return () => clearTimeout(timer); 
  }, [mensajeError]);


  return (
    <>
    {meal && alimentosProte && alimentosCarbs && alimentosFats &&
    (<Flex
        direction="column"
        align="center"
        bg="purple.100"
        w="100%"
        h="100%"
        justify="center"
        p="20px"
        minH="100vh"
        position={"relative"}
    >

        <BarraMenu rellena={"design"}></BarraMenu>

        {mensajeError != "" &&<PopUpErrorMessage title={'Error'} texto={mensajeError}></PopUpErrorMessage>}
        
        {/* titulo */}
        <CustomCard mt="0px" hijo={ 
          <>
          <Flex justify="start" gap="5px" align="center" mb="10px">
            <VStack>
            <Text fontSize="sm" fontWeight="700">
              DESIGN YOUR MEAL III:
            </Text>

            <Text fontSize="2xl" fontWeight="700">
              {`Meal ${toRoman(mealIndex.current)}`}
            </Text>
            </VStack>
          </Flex>

          <Box w="100%" borderBottom="2px solid black" my="20px" />

          <HStack spacing="40px">
            <Button
                variant="darkBrand"
                fontSize="sm"
                borderRadius="16px"
                bg="purple.100"
                w={{ base: '128px', md: '148px' }}
                h="46px"
                _hover={{ bg: "gray.100" }}
                onClick={backToMain}
            >
              Delete & Go back
            </Button>
            <Button
                variant="darkBrand"
                fontSize="sm"
                borderRadius="16px"
                bg="purple.100"
                w={{ base: '128px', md: '148px' }}
                h="46px"
                isDisabled ={salveDisabled} 
                _hover={{ bg: 'gray.100' }}
                onClick={salvaSeleccionado}
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>}
              >
                Save
                {/* {btnfinishedPulsado==true && (
                  <Spinner
                    size="sm"
                    ml={4}
                    color="white"
                  />
                )} */}
              </Button>
          </HStack>

          {/* {mensajeError == false && <Box mb="-20px"><SuccessErrorMessage status={'success'} title={'Food added!'}></SuccessErrorMessage></Box>} 
           */}
        </> }></CustomCard>

        {/* you need x calories */}
        <Card
          p={"20px"} 
          maxWidth="800px"
          mb={"10px"} 
          height="0px" 
          mt="10px"
          width={{ base: "90%", md: "100%" }} 
          align="center" 
          justify="center" 
          borderRadius={"12px"}
        >
          <Text fontSize="sm" fontWeight="700">
            You should eat aproximately {meal.caloriasTotal} kcal in this Meal
          </Text>
        </Card>

        {/* calories selected */}
        <Card
          p={"30px"} 
          maxWidth="200px"
          mb={"10px"} 
          height="0px" 
          mt="10px"
          width={{ base: "90%", md: "100%" }} 
          align="center" 
          justify="center" 
          borderRadius={"16px"}
        >
          <HStack>
            <CaloryIcon></CaloryIcon>
            <Text fontSize="lg" fontWeight="700">
              {calories} kcal
            </Text>
          </HStack>
        </Card>
        
        {/* tarjetas de meals */}
        <Box mb="20px" mt="10px">
          <BtnsMacrosFila macroViendo={macroViendo} setmacroViendo={setmacroViendo} />
        </Box>

        {/* necesitas .. tanto */}
        <Card
          p={"20px"} 
          maxWidth="800px"
          mb={"10px"} 
          height="0px" 
          width={{ base: "90%", md: "100%" }} 
          align="center" 
          justify="center" 
          borderRadius={"12px"}
        >
          <Text fontSize="sm" fontWeight="700">
            {textoRemember}
          </Text>
        </Card>
      

        {/* /////////////////////////////////////////////////// */}
        {/* alimentos con datos */}
        {macroViendo == 0 && alimentosProte.length > 0 && 
        <Box ml={{ base: "30px", md: "0px" }} w="100%" mb="30px" display="flex" justifyContent="center">
          <VStack>
            {alimentosProte.map((item, index) => (
              <AlimentoMacroMealViewCard key={index} macro={macroViendo} 
              alimento={item} 
              alimentos={alimentosProte}  setalimentos={setalimentosProte} 
              selectedAlimentos={selectedAlimentos} setselectedAlimentos={setselectedAlimentos}
              setcalories={setcalories}
              />
            ))}
          </VStack>
        </Box>}
        {/* mensaje si alimentos esta vacio */}
        {macroViendo == 0 && alimentosProte.length == 0 &&<Text color="red">You don't have favourites foods in PROTEIN macronutrient.</Text>}

        {macroViendo == 1 && alimentosFats.length > 0 && 
        <Box ml={{ base: "30px", md: "0px" }} w="100%" mb="30px" display="flex" justifyContent="center">
          <VStack>
            {alimentosFats.map((item, index) => (
              <AlimentoMacroMealViewCard key={index} macro={macroViendo} 
              alimento={item} 
              alimentos={alimentosFats}  setalimentos={setalimentosFats} 
              selectedAlimentos={selectedAlimentos} setselectedAlimentos={setselectedAlimentos}
              setcalories={setcalories}
              />
            ))}
          </VStack>
        </Box>}
        {/* mensaje si alimentos esta vacio */}
        {macroViendo == 1 && alimentosFats.length == 0 &&<Text color="red">You don't have favourites foods in FATS macronutrient</Text>}

        {macroViendo == 2 && alimentosCarbs.length > 0 && 
        <Box ml={{ base: "30px", md: "0px" }} w="100%" mb="30px" display="flex" justifyContent="center">
          <VStack>
            {alimentosCarbs.map((item, index) => (
              <AlimentoMacroMealViewCard key={index} macro={macroViendo} 
              alimento={item} 
              alimentos={alimentosCarbs}  setalimentos={setalimentosCarbs} 
              selectedAlimentos={selectedAlimentos} setselectedAlimentos={setselectedAlimentos}
              setcalories={setcalories}
              />
            ))}
          </VStack>
        </Box>}
        {/* mensaje si alimentos esta vacio */}
        {macroViendo == 2 && alimentosCarbs.length == 0 &&<Text color="red">You don't have favourites foods in CARBS macronutrient</Text>}
        
        {macroViendo == 3 && alimentosCarbs.length > 0 && 
        <Box ml={{ base: "30px", md: "0px" }} w="100%" mb="30px" display="flex" justifyContent="center">
          <VStack>
            {alimentosCarbs.map((item, index) => (
              <AlimentoMacroMealViewCard key={index} macro={macroViendo} 
              alimento={item} 
              alimentos={alimentosCarbs}  setalimentos={setalimentosCarbs} 
              selectedAlimentos={selectedAlimentos} setselectedAlimentos={setselectedAlimentos}
              setcalories={setcalories}
              />
            ))}
          </VStack>
        </Box>}
        {/* mensaje si alimentos esta vacio */}
        {macroViendo == 3 && alimentosCarbs.length == 0 &&<Text color="red">You don't have favourites foods in FIBER</Text>}
        {/* /////////////////////////////////////////////////// */}


        {/* botones ebook */}
        <CustomCard hijo={
          <Flex flexDirection={"column"} w="100%" gap={"10px"}>
            <EBookButton texto={'Why protein is important?'}></EBookButton>
            <EBookButton texto={'Why protein is important?'}></EBookButton>
          </Flex>} ></CustomCard>


    </Flex>)}
    {(!meal || !alimentosCarbs || !alimentosFats || !alimentosProte) && mensajeError == "" && <PurpleSpinner></PurpleSpinner>}
    {mensajeError != "" &&<PopUpErrorMessage title={'Error'} texto={mensajeError}></PopUpErrorMessage>}
    
    </>);

}
