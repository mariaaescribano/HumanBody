'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, Box, Text, Flex, Grid, VStack, Button, HStack } from '@chakra-ui/react';
import DuodenumInterior from '../../../../public/FatDigestion/DuodenumInterior.png';

//fotos
import Fatty from '../../../../public/FatDigestion/Parte3/Fatty.png';
import Glycerol from '../../../../public/FatDigestion/Parte3/Glycerol.png';
import Apolipoprotein from '../../../../public/FatDigestion/Parte4/Apolipoprotein.png';
import colesterolAtomo from '../../../../public/FatDigestion/Parte4/colesterolAtomo.png';
import OpenBox from '../../../../public/FatDigestion/Parte4/OpenBox.png';
import chylomicrons from '../../../../public/FatDigestion/Parte4/chylomicrons.png';
import Boxx from '../../../../public/FatDigestion/Parte4/Box.png';
import Intestine from '../../../../public/FatDigestion/Parte4/Intestine.png';

import dialogo from '../../../../public/dialogo.png';
import LeftRightButtons from '@/components/global/old/LeftRightButtons';
import PopUpMessage from '@/components/global/PopUpMessage';
import IzqPurpleMessage from '@/components/global/old/IzqPurpleMessage';
import DerPurpleMessage from '@/components/global/DerPurpleMessage';
import BarnerMorado from '@/components/global/BarnerMorado';
import { EscribirTextoDinamico, getTamanyoPantalla, handleMouseEndGlobalHelper, handleMouseStartGlobalHelper, handleMoveMouse, handleTouchEndGlobalHelper, handleTouchMoveGlobalHelper, handleTouchStartGlobalHelper, moveWithKey, moveWithKeyBucle, putDefaultKeys, stopMoveWithKey } from '../../../../GlobalHelper';
import { motion } from "framer-motion";

const Parte4FatDigestion = () => 
{
  //movimientos
  const [position1, setPosition1] = useState({ x: 0, y: 0 });
  const [position2, setPosition2] = useState({ x: 0, y: 0 });
  const [position3, setPosition3] = useState({ x: 0, y: 0 });
  const [position4, setPosition4] = useState({ x: 0, y: 0 });

  //visibilidad objetos
  const [glycerol, setglycerol] = useState(true);
  const [FFA, setFFA] = useState(true);
  const [colesterol, setcolesterol] = useState(true);
  const [apol, setapol] = useState(true);

  const [screenSize, setScreenSize] = useState(null);
  const [finish, setFinish] = useState(false);
  const [breakTry, setbreakTry] = useState(false);
  const [contador, setcontador] = useState<number>(0);

  const [verChylom, setverChylom] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);



  // tamaño pantalla
  useEffect(() => 
  {
    getTamanyoPantalla(setScreenSize);
  }, []);


  useEffect(() => 
  {
    if(screenSize=="sm")
    {
      setPosition2({x:50, y:10});
      setPosition4({x:50, y:70});
    }
    else
    {
      setPosition2({x:70, y:10});
      setPosition4({x:70, y:70});
    }
    setPosition1({x:10, y:10});
    setPosition3({x:10, y:70});

  }, [screenSize]);


  // comprobar si los objetos se tocan
  // const checkOverlap = () => 
  // {
  //   if(position.x!= undefined && position.y!= undefined)
  //   {
  //       if(screenSize=="xl")
  //       {
  //           if(position.x >= 22 && position.x <= 55
  //           && position.y >= 19 && position.y <= 60 )
  //           {
  //           setbreakTry(true); 
  //           }
  //       }
  //       else if(screenSize=="sm")
  //       {
  //           if(position.x >= 6 && position.x <= 50
  //           && position.y >= 17 && position.y <= 67 )
  //           {
  //               setbreakTry(true); 
  //           }
  //       }
  //   }
  // };

  useEffect(() => {
    // Configura un temporizador cuando breakTry cambia
    const timer = setTimeout(() => {
        if (breakTry) {
            // Si breakTry es true, establece el finish después de 3 segundos
            setTimeout(() => {
                setFinish(true);
            }, 3000);
        }
    }, 3000);
    
    // Limpieza de temporizadores al desmontar o cambiar breakTry
    return () => clearTimeout(timer); 
  }, [breakTry]);



  // comprobar si los objetos se tocan
  const checkOverlap = (posiNueva:any) => 
  {
    if(posiNueva.x!= undefined && posiNueva.y!= undefined)
    {
      if(screenSize=="xl")
      {
        if(posiNueva.x >= 26 && posiNueva.x <= 50
        && posiNueva.y >= 35 && posiNueva.y <= 50 )
        {
          setInvisibleObjeto()
        }
      }
      else if(screenSize=="sm")
      {
        if(posiNueva.x >= 16 && posiNueva.x <= 45
        && posiNueva.y >= 34 && posiNueva.y <= 40 )
        {
          setInvisibleObjeto()
        }
      }
    }
  };

  const setInvisibleObjeto = () =>
  {
    if(elige == 1)
    {
      setglycerol(false)
      if(glycerol==true)
      {
        setcontador(contador+1)
      }
    }
    else if(elige ==2)
    {
      setFFA(false)
      if(FFA==true)
        {
          setcontador(contador+1)
        }
    }
    else if(elige ==3)
      {
        setapol(false)
        if(apol==true)
          {
            setcontador(contador+1)
          }
      }
      else if(elige == 4)
        {
          setcolesterol(false)
          if(colesterol==true)
            {
              setcontador(contador+1)
            }
        }
  };

  //comprobar si contador ya es 4
  useEffect(() => 
  {
    if(contador == 4)
      {
        const timer = setTimeout(() => 
        {
            // Si breakTry es true, establece el finish después de 3 segundos
            setTimeout(() => {
              setverChylom(true);
            }, 100);
        }, 100);
        
        // Limpieza de temporizadores al desmontar o cambiar breakTry
        return () => clearTimeout(timer); 
      }
  }, [contador]);

  useEffect(() => 
  {
    if(verChylom == true)
      {
        const timer = setTimeout(() => 
        {
            // Si breakTry es true, establece el finish después de 3 segundos
            setTimeout(() => {
              setbreakTry(true);
            }, 100);
        }, 100);
        
        // Limpieza de temporizadores al desmontar o cambiar breakTry
        return () => clearTimeout(timer); 
      }
  }, [verChylom]);





  const damePosQueMover = (numero:number) =>
  {
    switch (numero) {
      case 1: return setPosition1;
      case 2: return setPosition2;
      case 3: return setPosition3;
      case 4: return setPosition4;
      default: return null;
    }
  };



//////////////////////// MOVIMIENTO LIPASA /////////////////////
//////////////////// MOVIL MOVEMENT ///////////////////////////
  const isTouching = useRef(false); // Para controlar si el usuario sigue tocando

  // Función para manejar el inicio del toque
  const handleTouchStart = (e: {TouchEvent:any, preventDefault:any}, numero:number) => 
  {
    handleTouchStartGlobalHelper(e, isTouching);
  };

  // Función para manejar el movimiento del dedo
  const handleTouchMove = (e: React.TouchEvent, numero:number) => 
  {
    let mandar = damePosQueMover(numero);
    let posiNueva = handleTouchMoveGlobalHelper(e, containerRef, 50, 70, mandar);
    checkOverlap(posiNueva);
  };

  // Función para manejar el fin del toque
  const handleTouchEnd = (e: unknown, p0: number) => 
  {
    handleTouchEndGlobalHelper(isTouching);
  };
  //////////////////// END MOVIL MOVEMENT ///////////////////////////





  const [elige, setelige] = useState(0);
  const isInteracting = useRef(false); // Controla si el usuario está interactuando

  // Manejar inicio del toque o clic
  const handleStart = (e: React.MouseEvent, number:number) => 
  {
    setelige(number)
    let mueve = damePosQueMover(number);
    handleMouseStartGlobalHelper(e, isInteracting, containerRef, mueve);
  };

  // Manejar movimiento del dedo o ratón
  const handleMove = (e: React.MouseEvent) => 
  {
    if(elige != 0)
    {
      let mueve = damePosQueMover(elige);
      let posiNueva = handleMoveMouse(e, isInteracting, containerRef, mueve);
      checkOverlap(posiNueva);
    }
   
  };

  // Finalizar la interacción
  const handleEnd = () => 
  {
    setelige(0)
    handleMouseEndGlobalHelper(isInteracting);
  };





  // textos
  const textScience = "In the small intestine, chylomicrons are formed. \n Chylomicrons are structures that transport fat to the bloodstream.";
  const textGame = "To form a Chylomicron, drag all the atoms until the open box and see what happens.";

  const [scienceText, setscienceText] = useState(""); // State for visible text
  const [gameText, setgameText] = useState(""); // State for visible text
  const [index, setIndex] = useState(0); // Tracks the current letter
  const [orden, setorden] = useState(0); // Tracks the current letter

  useEffect(() => 
  {
    if(orden == 0)
    {
      EscribirTextoDinamico(textScience, setscienceText , setIndex, index, orden, setorden);
    }
    else
    {
      EscribirTextoDinamico(textGame, setgameText , setIndex, index, orden, setorden);
    }

  }, [index, orden]);



  return (

    <Box pt={{ base: '20px', md: '20px', xl: '20px' }}>
    
      {/* Barner morado*/}
      <BarnerMorado title={'HUMAN BODY: FAT DIGESTION IV'}></BarnerMorado>

      <Flex
        direction="row"
        width="100%"
        p="30px"
        mt="-10px"
        justifyContent="center" // Centra el contenedor general
        alignItems="center"
      >
        <Grid
          width="100%"
          gridTemplateColumns={{
            base: '1fr',          // Una columna en pantallas pequeñas (móvil)
            md: '1fr 1fr 1fr',    // Tres columnas iguales en pantallas medianas y mayores
            '2xl': '1fr 2fr 1fr', // Columna del medio más ancha en pantallas grandes
          }}
          justifyItems="center" // Centra el contenido dentro de sus columnas
          alignItems="center" // Centra verticalmente las columnas
          gap="20px"
        >
          {finish == true && <PopUpMessage title={"Discover what happens next..."} texto={"Discover how the fat you eat affects Chylomicron's structure."}
                  but1={"GO!"} but2={"" } url1={"../FatDigestion/parte5"} url2={""} />}


          {/* Primera columna - Izquierda */}
          <IzqPurpleMessage scienceText={scienceText}></IzqPurpleMessage>

          
          {/* Segunda columna - Centro */}
          {screenSize !== null && 
          <Flex
            justifyContent="center"
            alignItems="center"
            w="100%"
          >
            <Card
            ref={containerRef}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            w="90%"
            h={{ base: "500px", md: "600px" }}
            borderRadius="30px"

            // onMouseDown={(e) => handleStart(e, 1)}
            onMouseMove={(e) => handleMove(e)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}

            boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"
            style={{
                position: 'relative',
                touchAction: "none",
                overscrollBehavior: "none"
            }}>
            {screenSize != null && <div
                style={{
                position: "absolute",
                width: "70%",
                height: screenSize == "xl" ? "60%" : "50%",
                backgroundImage: verChylom== true ? "" : `url(${Intestine.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: 0.3,
                zIndex: 0,
                }}
            />}

            {/* Glycerol en la esquina superior izquierda */}
            {glycerol == true && <VStack
                position="absolute"
                top={`${position1.y}%`}
                left={`${position1.x}%`}
                zIndex={1}
                width="120px"
                height="120px"
                onTouchStart={(e) => handleTouchStart(e, 1)}
                onTouchMove={(e) => handleTouchMove(e, 1)}
                onTouchEnd={(e) => handleTouchEnd(e, 1)}

                onMouseDown={(e) => handleStart(e, 1)}
                 //raton
                // onMouseDown={(e) => handleStart(e, 1)}
                // onMouseMove={(e) => handleMove(e, 1)}
                // onMouseUp={handleEnd}
                // onMouseLeave={handleEnd}
            >
                <Box
                position="absolute"
                width="100%"
                height="80%"
                borderRadius="20px"
                backgroundImage={`url(${Glycerol.src})`}
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                />
                <Text position="absolute" mt="-30px" color="black" fontFamily="Times New Roman, serif" fontSize="2xl" textShadow="2px 2px 4px white, -2px -2px 4px white">
                  Glycerol
                </Text>
            </VStack>}


            {/* FFA en la esquina superior derecha */}
            {FFA == true && <VStack
                position="absolute"
                top={`${position2.y}%`}
                left={`${position2.x}%`}
                zIndex={1}
                width="150px"
                height="150px"
                onTouchStart={(e) => handleTouchStart(e, 2)}
                onTouchMove={(e) => handleTouchMove(e, 2)}
                onTouchEnd={(e) => handleTouchEnd(e, 2)}
                onMouseDown={(e) => handleStart(e, 2)}
            >
                <Box
                position="absolute"
                width="70%"
                height="80%"
                borderRadius="20px"
                backgroundImage={`url(${Fatty.src})`}
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                />
                <Text position="absolute" mt="-30px" color="black" fontFamily="Times New Roman, serif" fontSize="2xl" textShadow="2px 2px 4px white, -2px -2px 4px white">
                Free Fatty Acid
                </Text>
            </VStack>}

            {/* Apolipoproteins en la esquina inferior izquierda */}
            {apol == true && <VStack
                position="absolute"
                top={`${position3.y}%`}
                left={`${position3.x}%`}
                zIndex={1}
                width="120px"
                height="120px"
                onTouchStart={(e) => handleTouchStart(e, 3)}
                onTouchMove={(e) => handleTouchMove(e, 3)}
                onTouchEnd={(e) => handleTouchEnd(e, 3)}
                onMouseDown={(e) => handleStart(e, 3)}
            >
                <Box
                position="absolute"
                width="100%"
                height="70%"
                borderRadius="20px"
                backgroundImage={`url(${Apolipoprotein.src})`}
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                />
                <Text position="absolute" mt="-30px" color="black" fontFamily="Times New Roman, serif" fontSize="2xl" textShadow="2px 2px 4px white, -2px -2px 4px white">
                Apolipoprotein
                </Text>
            </VStack>}

            {/* Colesterol en la esquina inferior derecha */}
            {colesterol == true &&<VStack
                position="absolute"
                top={`${position4.y}%`}
                left={`${position4.x}%`}
                zIndex={1}
                width="150px"
                height="150px"
                onTouchStart={(e) => handleTouchStart(e, 4)}
                onTouchMove={(e) => handleTouchMove(e, 4)}
                onTouchEnd={(e) => handleTouchEnd(e, 4)}
                onMouseDown={(e) => handleStart(e, 4)}
            >
                <Box
                position="absolute"
                width="100%"
                height="80%"
                borderRadius="20px"
                backgroundImage={`url(${colesterolAtomo.src})`}
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                />
                <Text position="absolute" mt="-30px" color="black" fontFamily="Times New Roman, serif" fontSize="2xl" textShadow="2px 2px 4px white, -2px -2px 4px white">
                Cholesterol
                </Text>
            </VStack>}

            {/* Open Box en el centro */}
            {contador !== 4 &&  <VStack
                position="absolute"
                top="50%" 
                left="50%" 
                transform="translate(-50%, -50%)" 
                zIndex={1}
                width="100px"
                height="100px"
            >
                <Box
                position="absolute"
                width="100%"
                height="80%"
                borderRadius="20px"
                backgroundImage={`url(${OpenBox.src})`}
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                />
                <Text position="absolute" mt="-30px" color="black" fontFamily="Times New Roman, serif" fontSize="2xl" textShadow="2px 2px 4px white, -2px -2px 4px white">
                Chylomicron 
                </Text>
            </VStack> }


            {/* Box movediza en el centro */}
            { contador == 4 && 
            <motion.div
              animate={{
                x: [0, -5, 5, -5, 5, 0], // Pequeños movimientos en X
                y: [0, 2, -2, 2, -2, 0] // Pequeños movimientos en Y
              }}
              transition={{
                duration: 0.5, // Duración de cada sacudida
                repeat: Infinity, // Repetir infinitamente
                ease: "easeInOut" // Suaviza la animación
              }}
              style={{
                width: 100,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10
              }}
            >
              <VStack
                position="absolute"
                top="50%" 
                left="50%" 
                transform="translate(-50%, -50%)" 
                zIndex={1}
                width="100px"
                height="100px"
            >
                <Box
                position="absolute"
                width="100%"
                height="80%"
                borderRadius="20px"
                backgroundImage={`url(${Boxx.src})`}
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                />
              </VStack> 
            </motion.div>}


            




             {/* chylomicrons en el centro */}
             { verChylom== true && <VStack
                  position="absolute"
                  top="50%" 
                  left="50%" 
                  transform="translate(-50%, -50%)" 
                  zIndex={1}
                  width="300px"
                  height="300px"
              >
                  <Box
                    position="absolute"
                    width="100%"
                    height="100%"
                    backgroundImage={`url(${chylomicrons.src})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    backgroundRepeat="no-repeat"
                    filter="drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.5))" // ✅ Sombra adaptada a la imagen
                  />

                  <Text position="absolute" mt="-30px" color="black" fontFamily="Times New Roman, serif" fontSize="2xl" textShadow="2px 2px 4px white, -2px -2px 4px white">
                  Chylomicron !!
                  </Text>
              </VStack> }

            </Card>

          </Flex>}

         


          {/* Tercera columna - Derecha */}
          <DerPurpleMessage gameText={gameText} urlLeft={"../FatDigestion/parte3"} urlRight={"../FatDigestion/parte5"}></DerPurpleMessage>

        </Grid>
      </Flex>
    </Box>
  );
};

export default Parte4FatDigestion;
