'use client';
// Chakra imports
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Icon,
  IconButton,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import NatureIcon from '@mui/icons-material/Nature';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import SelectSignIn from '@/components/signin/SelectSignIn';
import PopUpMessage from '@/components/global/message/PopUpMessage';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';
import PurpleSpinner from '@/components/global/random/PurpleSpinner';
import CustomCard from '@/components/global/cards/CustomCard';
import { API_URL, calcularPorcentajes, cogePacientesDeNutri, colorNutricionist, convierteNumRedondeado, crearRecibo, dameDatosDeAlimentoConcreto, dameDatosDelRecibo, dameNutriNom, dameReciboDeAlimentoConcreto, esSoloNumeros, getTamanyoPantalla, guardaAlimentoComido, redirigirSiNoHayNutriNom, redirigirSiNoHayUserNom, reglasDeTresParaAlimentoGramosPersonalizados, StringIsNull, sumaDeMacros, tryAgain, update } from '../../../GlobalHelper';
import { alimentosComidosSkeleton, alimentosSkeleton } from '../../../../../backend/src/dto/alimentos.dto';
import { reciboSkeleton, showMacroNutrSignUp } from '../../../../../backend/src/dto/recibos.dto';
import SuccessErrorMessage from '@/components/global/message/SuccessErrorMessage';
import FiberCard from '@/components/global/cards/FiberCard';
import InputField from '@/components/global/random/InputField';
import { PieChardMacroNutr } from '@/components/global/cards/PieChardMacroNutr';
import CalorGramsSelectCard from '@/components/addfood/verAlimento/CalorGramsSelectCard';
import MacroNutrCard from '@/components/signin/MacroNutrCard';
import { showEbook } from '../../../../../backend/src/dto/ebook.dto';
import { useRouter } from 'next/navigation';
import BarraMenu from '@/components/global/BarraMenu';
import BarraMenuNutri from '@/components/nutritionist/BarraMenuNutri';
import RecommendCard from './RecommendCard';
import { patientSkeleton } from '../../../../../backend/src/dto/nutri.dto';

export default function VerAlimentoPage(props: 
{ 
    nutri: string; 
    alimento: alimentosSkeleton; 
    setalimento: any; 
}) 
{
  const { alimento, setalimento, nutri } = props;
  const [reciboHoy, setreciboHoy ] = useState< reciboSkeleton | null >(null);

  const [btnfinishedPulsado, setbtnfinishedPulsado ] = useState<boolean>(false);
  const [mensajeError, setmensajeError ] = useState<boolean| undefined>(undefined);

  ///////////////  GESTION ALIMENTO VALORES ///////////////
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [screenSize, setscreenSize ] = useState<string>("");

  // aqui se guarda los valores por 100 gr del alimento
  const [reciboOriginal, setreciboOriginal ] = useState< reciboSkeleton >(
    {
      grasas:"",
      monoinsaturadas:"",
      poliinsaturadas:"",
      saturadas:"",
      prote:"",
      incompleto:"",
      completo:"",
      carbs:"",
      complejos:"",
      simples:"",
      fibra:""
    }
  );

  // aqui se guardan los valores personalizados dependiendo de los gramos q ponga el user
  // empiezan siendo igual a los originales ( gramos por defecto son 100 )
  const [reciboPersonalizado, setreciboPersonalizado ] = useState< reciboSkeleton >(
    {
      grasas:"",
      monoinsaturadas:"",
      poliinsaturadas:"",
      saturadas:"",
      prote:"",
      incompleto:"",
      completo:"",
      carbs:"",
      complejos:"",
      simples:"",
      fibra:""
    }
  );

  const predomina = useRef<string>("0");

  // what user ate
  const [calories, setcalories ] = useState<string>("");
  const [grams, setgrams ] = useState<string>("100");

  // se actualiza solo una vez, con los valores originales (no sentido q cambie)
  const [pieChardData, setpieChardData ] = useState<number[]>([]);

  // nutri
  const [patients, setpatients] = useState<patientSkeleton[] | null | []>(null);
  const [patientElegido, setpatientElegido] = useState<patientSkeleton| null>(null);
  const [recommended, setrecommended] = useState<boolean>(false);
  /////////////// /////////////// ///////////////



  /////////////// NUTRI MOVIDAS ///////////////
  
  // 0: if its nutri, we take the patients
  const cogePacientes = async () =>
  {
    let nutriNom = dameNutriNom();
    let pacientes = await cogePacientesDeNutri(nutriNom)
    if(pacientes)
    {
        setpatients(pacientes)
    }
  };

  // 1: if nutri has selected a patient...
  // STRATEGY
  // a foodComido is created and is putted in nutriComentarios-> nutriRecomienda
  useEffect(() => 
  {
    const managePatientElegido = async () =>
    {
      let alimentoComido: alimentosComidosSkeleton =
      {
        gramosTotales: grams,
        calorias: calories,
        predomina: Number(predomina.current),
        nom: alimento?.nombre,
        idAlimento: Number(alimento?.id)
      };
      let idAlimentoComido = await guardaAlimentoComido(alimentoComido);
      await insertaEnNutriComents(idAlimentoComido)

    };

    if(patientElegido)
      managePatientElegido()

  }, [patientElegido]);

  const insertaEnNutriComents = async (idAlimentoComido:string) =>
  {
    try {
      const response = await axios.put(
          `${API_URL}/nutricomentarios/poraqui/${patientElegido?.nombre}/${nutri}/${idAlimentoComido}`,
          {
            headers: {
                'Content-Type': 'application/json'
            },
          }
      );
        if(response.data == "")
        {
          setrecommended(true)
          setpatientElegido(null)
          const timer = setTimeout(() => {
            location.href = "./buscarAlimento?soyNutri=true";
          }, 3000);
          return () => clearTimeout(timer); 
        }
      }
      catch (error) 
      {
        setmensajeError(true)
        console.error('Error fetching data:', error);
      }
  };

  /////////////// END NUTRI MOVIDAS ///////////////



  // 0: coge id y tamaño pantalla
  useEffect(() => 
  {
    if(nutri == "-1")
    {
        redirigirSiNoHayUserNom();
    }
    else
    {
       redirigirSiNoHayNutriNom()
       cogePacientes()
    }
    getTamanyoPantalla(setscreenSize)
    const queryParams = new URLSearchParams(location.search);
    const idAlimento = queryParams.get('idAlimento') || '';
    dameDatosDeAlimento(parseInt(idAlimento, 10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nutri]);

  // 1: coge alimento de BD
  const dameDatosDeAlimento = async (idAlimento:number) =>
  {
    let alimentoConcreto = await dameDatosDeAlimentoConcreto(idAlimento);
    if(alimentoConcreto != null)
    {
      predomina.current = alimentoConcreto.predomina;
      setalimento(alimentoConcreto)
      setcalories(alimentoConcreto.calorias_100gr)
      dameReciboDeAlimento(alimentoConcreto.recibo_id);
    }
  };

  // 2: coge el recibo para acceder a sus datos nutricionales
  const dameReciboDeAlimento = async (idRecibo:number) =>
  {
    let recibo = await dameReciboDeAlimentoConcreto(idRecibo)
    if(recibo != null)
    {
      setreciboOriginal(recibo)
      setreciboPersonalizado(recibo)
      setpieChardData([parseInt(recibo.prote, 10), parseInt(recibo.grasas, 10), parseInt(recibo.carbs, 10), parseInt(recibo.fibra, 10)])
    }
  };


  // cada vez q los gramos cambien, las calorias y macros deben de ser actualizadas
  useEffect(() => 
  {
    if(calories!= "" && alimento && reciboPersonalizado)
    {
      let nuevoReciboPersonalizado= reglasDeTresParaAlimentoGramosPersonalizados(reciboOriginal, grams, alimento, setcalories)
      if(nuevoReciboPersonalizado)
        setreciboPersonalizado(nuevoReciboPersonalizado)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grams]);

  /////////////// END GESTION ALIMENTO VALORES ///////////////




  // 1: cuando user le da a Add
  const addFood = async () =>
  {
    setbtnfinishedPulsado(true)
    //  se coge su recibo
    let idreciboDeHoy = sessionStorage.getItem("reciboDeHoy");
    if(idreciboDeHoy!= null)
    {
      await dameDatosDelRecibo(parseInt(idreciboDeHoy, 10), setreciboHoy);
    }
    else
    {
      setmensajeError(true)
    }
    setbtnfinishedPulsado(false)
  };

  // 2: suma
  useEffect(() => 
  {
    if(reciboHoy)
    {
      // se hace la suma
      let idreciboDeHoy = sessionStorage.getItem("reciboDeHoy");
      let reciboSuma = sumaDeMacros(reciboPersonalizado, reciboHoy);
      if(reciboSuma && idreciboDeHoy)
      {
        // 3: si todo ha ido bien 
        update(reciboSuma, idreciboDeHoy, grams, predomina.current, calories, setmensajeError, alimento);
      }
        
      else
        setmensajeError(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reciboHoy]);



  // 4: si todo ha ido bien, se vuelve a buscar alimento
  useEffect(() => 
  {
    if (mensajeError==false) {
      const timer = setTimeout(() => {
        location.href = "./buscarAlimento";
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [mensajeError]);
  
  




   // listas usadas para mostrar datos
  
    const proteinEbooks: showEbook[] = [
    {
        title: "What are amino acids?",
        onclick: undefined
    },
    {
        title: "How proteins repair my cells?",
        onclick: undefined
    }
    ];

    let proteinButtons: showMacroNutrSignUp[] = [];

    if (reciboPersonalizado != null) 
    {
        proteinButtons = [
            { 
            label: "Complete proteins", 
            price: `${reciboPersonalizado.completo == "" ? 0 : reciboPersonalizado.completo} grams`, 
            tooltip: "Contain all essential amino acids your body needs for regeneration." 
            },
            { 
            label: "Incomplete proteins", 
            price: `${reciboPersonalizado.incompleto} grams`, 
            tooltip: "Lack one or more essential amino acids needed for regeneration." 
            }
        ];
    }

    const fatEbooks: showEbook[] = [
        {
          title: "How monounsaturated fats help me?",
          onclick: undefined
        },
        {
          title: "How polyunsaturated fats help me?",
          onclick: undefined
        },
        {
          title: "Why saturated fats can hurt me?",
          onclick: undefined
        }
    ];
    
    let fatButtons: showMacroNutrSignUp[] = [];
    
    if (reciboPersonalizado != null) {
        fatButtons = [
            {
            label: "Monounsaturated",
            price: `${reciboPersonalizado.monoinsaturadas} grams`,
            tooltip: "Heart-friendly fats that support cholesterol balance and overall health."
            },
            {
            label: "Polyunsaturated",
            price: `${reciboPersonalizado.poliinsaturadas} grams`,
            tooltip: "Essential fats, including omega-3 and omega-6, crucial for brain and cell function."
            },
            {
            label: "Saturated",
            price: `${reciboPersonalizado.saturadas} grams`,
            tooltip: "Stable fats that provide energy but should be consumed in moderation."
            }
        ];
    }
      
    const carbEbooks: showEbook[] = [
    {
        title: "Why I need complex carbs?",
        onclick: undefined
    },
    {
        title: "Do I need simple carbs?",
        onclick: undefined
    }
    ];

    const fiberEbooks: showEbook[] = [
    {
        title: "Fiber and microbiota",
        onclick: undefined
    },
    {
        title: "Fiber and neurogenesis",
        onclick: undefined
    },
    {
        title: "Fiber and neurotransmissors",
        onclick: undefined
    }
    ];
    
    let carbButtons: showMacroNutrSignUp[] = [];
    
    if (reciboPersonalizado != null) {
    carbButtons = [
        // {
        // label: "Fiber",
        // price: `${recibo.fibra} grams`,
        // tooltip: "Fiber promotes healthy digestion, supports heart health, helps regulate blood sugar levels and supports neuron and brain activity."
        // },
        {
        label: "Complex",
        price: `${ Math.round(parseInt(reciboPersonalizado.complejos, 10)) } grams`,
        tooltip: "Provide long-lasting energy and fiber, digesting slowly."
        },
        {
        label: "Simples",
        price: `${reciboPersonalizado.simples} grams`,
        tooltip: "Digest quickly, giving a fast but short energy boost."
        }
    ];
    }


  
// region return

  return (
    <>
    {screenSize != "" && alimento!= null && reciboPersonalizado &&
    <Flex
        direction="column"
        align="center"
        bg={nutri != "-1" ? colorNutricionist : "purple.100"}
        w="100%"
        h="100%"
        justify="center"
        p="20px"
        minH="100vh"
        position={"relative"}
    >

    {nutri=="-1" && <BarraMenu></BarraMenu>}
    {nutri!=="-1" && <BarraMenuNutri></BarraMenuNutri>}
        
    {/* titulo */}
    {mensajeError == true && <PopUpErrorMessage title={'Error'} texto={tryAgain}></PopUpErrorMessage>}
    <CustomCard mt="0px" p={nutri == "-1" ? "30px" : "20px"} hijo={ 
        <>
        <Flex justify="start" gap="5px" align="center" mb="10px">
        <VStack>
        <Text color={textColor} fontSize="sm" fontWeight="700">
            {nutri == "-1" ? "Adding food:" : "Recommending food:"}
        </Text>

        <Text color={textColor} fontSize="2xl" fontWeight="700">
            {alimento.nombre}
        </Text>
        </VStack>
        </Flex>

        {nutri == "-1" &&
        <> 
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
                onClick={() => location.href = "./buscarAlimento"}
            >
            X  CANCEL
            </Button>
            <Button
                variant="darkBrand"
                fontSize="sm"
                borderRadius="16px"
                bg="purple.100"
                w={{ base: '128px', md: '148px' }}
                h="46px"
                isDisabled ={btnfinishedPulsado } // esta disabled cuando se le ha dado al boton, para no darle mas veces
                _hover={{ bg: 'gray.100' }}
                onClick={addFood}
                leftIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>}
            >
                ADD
                {btnfinishedPulsado==true && (
                <Spinner
                    size="sm"
                    ml={4}
                    color="white"
                />
                )}
            </Button>
        </HStack>
        </>}

        {mensajeError == false && <Box mb="-20px"><SuccessErrorMessage status={'success'} title={'Food added!'}></SuccessErrorMessage></Box>} 
        
    </> }></CustomCard>


    {/* recommending to ... patient */}
    { patients && 
    <CustomCard mt="10px" p="20px" hijo={ 
      <RecommendCard patients={patients} recommending={true} recommended={recommended}
      setpatientElegido={setpatientElegido} patientElegido={patientElegido}/>
    }></CustomCard>}
    

    <CustomCard mt="10px" p="30px" hijo={ 
        <>
        <Box mb={{ base: '20px', md: '20px' }}>
            <SimpleGrid columns={{ base: 1, md: 2 }}>
            <Box w='100%' ml={{ md: "140px" }}>
                <CalorGramsSelectCard calories={calories} grams={grams} setgrams={setgrams}></CalorGramsSelectCard>
            </Box>
            {pieChardData.length > 0 && 
            <Box w={{ base: '200px', md: '100%' }} ml={{ md: "-40px" }} mt={{ base: "20px", md: "0px" }}>
                <PieChardMacroNutr pieChartData={pieChardData} />
            </Box>}
            </SimpleGrid>
        </Box>
        </>
    }></CustomCard>

    {screenSize != "" && 
    <CustomCard mt="10px" hijo={ 
    <MacroNutrCard title={"PROTEINS"} total={reciboPersonalizado.prote == "" ? "0" : Math.round(parseInt(reciboPersonalizado.prote,10)).toString()} infoLista={proteinButtons} screenSize={screenSize} ebooklista={[]}></MacroNutrCard>}>
    </CustomCard>}

    {screenSize != "" && 
    <CustomCard mt="10px" hijo={ 
    <MacroNutrCard title={"FATS"} total={reciboPersonalizado.grasas == "" ? "0" : Math.round(parseInt(reciboPersonalizado.grasas,10)).toString()} infoLista={fatButtons} screenSize={screenSize} ebooklista={[]}></MacroNutrCard>}>
    </CustomCard>}

    {screenSize != "" && 
    <CustomCard mt="10px" hijo={ 
    <MacroNutrCard title={"CARBS"} total={reciboPersonalizado.carbs == "" ? "0" : Math.round(parseInt(reciboPersonalizado.carbs,10)).toString()} infoLista={carbButtons} screenSize={screenSize} ebooklista={[]}></MacroNutrCard>}>
    </CustomCard>}

    {screenSize != "" && <CustomCard mt="10px" hijo={ 
    <FiberCard edit={false} totalFiber={reciboPersonalizado.fibra == "" ? "0" : Math.round(parseInt(reciboPersonalizado.fibra,10)).toString()} screenSize={screenSize}></FiberCard>}></CustomCard>}

    </Flex>}

      {screenSize == "" && pieChardData.length == 0 && <PurpleSpinner></PurpleSpinner>}
    </>);

}
