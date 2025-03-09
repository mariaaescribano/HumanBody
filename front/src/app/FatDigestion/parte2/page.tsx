'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, Box, Text, Flex, Grid, VStack, Button, HStack } from '@chakra-ui/react';
import Duodenum from '../../../../public/FatDigestion/Duodenum.jpg';
import Fat from '../../../../public/FatDigestion/Fat.png';
import dialogo from '../../../../public/dialogo.png';
import LeftRightButtons from '@/components/global/old/LeftRightButtons';
import PopUpMessage from '@/components/global/message/PopUpMessage';
import IzqPurpleMessage from '@/components/global/old/IzqPurpleMessage';
import DerPurpleMessage from '@/components/global/DerPurpleMessage';
import BarnerMorado from '@/components/global/BarnerMorado';
import { EscribirTextoDinamico } from '../../../GlobalHelper';
import { motion } from "framer-motion";

const Parte2FatDigestion = () => 
{
  //movimiento bile
  const [position, setPosition] = useState({ x: 41, y: 60 }); // Coordenadas del punto
  const [moving, setMoving] = useState(false);
  const [direction, setDirection] = useState("right");

  const [screenSize, setScreenSize] = useState("sm");
  const [finish, setFinish] = useState(false);

  //expandir tamaño
  const [size, setSize] = useState(50); 
  const [borderRadius, setborderRadius] = useState(30); 
  const [expanding, setExpanding] = useState(false);



  

  // 0) tamaño pantalla
  useEffect(() => 
  {
    const mediaQueryXL = window.matchMedia("(min-width: 1200px)");
    const mediaQueryMD = window.matchMedia("(min-width: 768px) and (max-width: 1199px)");
    const mediaQuerySM = window.matchMedia("(max-width: 767px)");

    const updateScreenSize = () => 
    {
      if (mediaQueryXL.matches) 
      {
        setScreenSize("xl");
      } else if (mediaQueryMD.matches) {
        setScreenSize("md");
      } else if (mediaQuerySM.matches) {
        setScreenSize("sm");
      }
    };

    updateScreenSize(); // Configura el tamaño al iniciar
  }, []);


  // 1) FAT MOVEMENT
  const [fatPos, setFatPos] = useState({ x: 0, y:0 }); 
  const [stop, setStop] = useState<boolean>(false); 
  const [ver, setVer] = useState<boolean>(false); 
  const containerRef = useRef<HTMLDivElement>(null);

  const path = [
    { x: 520, y:170 },
    { x: 520, y:170 },
    { x: 510, y: 320 }, 
    { x: 430, y: 380 },
    { x: 320, y: 380 },
    { x: 320, y: 420 },
    { x: 320, y: 420 },
  ];

  useEffect(() => 
  {
    if(screenSize == "xl")
    {
      let currentStep = 0;
      const interval = setInterval(() => 
      {
        if(stop== false)
        {
          // para ir moviendo punto por punto
          setFatPos(path[currentStep]);
          currentStep = (currentStep + 1) % path.length; 
          
          // para evitar como se coloca la bola en la primera pos (viene desde arriba)
          if(currentStep==2)
          {
            setVer(true)
          }  
          
          // para ver si ya ha llegado al ultimo punto
          if(currentStep == path.length-1)
          {
            setStop(true)
            clearInterval(interval);
          }
        }
          
      }, 1000); // Cambia de posición cada 2 segundos
    
      return () => clearInterval(interval); // Limpia el intervalo
    }
  }, [screenSize]);


  // 3) comprobar si los objetos se tocan
  const boxRef1 = useRef(null);
  const boxRef2 = useRef(null);

  const checkOverlap = () => 
  {
    if(screenSize=="xl")
    {
      if(position.x >= 47 && position.x <= 50
      && position.y >= 69 && position.y <= 75 )
      {
        setExpanding(true); 
        setFatPos({x:300, y:70});
      }
    }
    else if(screenSize=="sm")
    {
      if(position.x >= 40 && position.x <= 50
      && position.y >= 72 && position.y <= 81 )
      {
        setExpanding(true); 
        setFatPos({x:0, y:-150});
      }
    }
  };


  // 4) expandir Fat
  useEffect(() => {
    let interval: number | NodeJS.Timeout | undefined;

    // Función que controla el aumento del tamaño
    if (expanding==true) {
      interval = setInterval(() => 
      {
        setSize((prevSize) => 
        {
          if (prevSize < 200) 
          {
            return prevSize + 2; // Incrementa el tamaño en 2px
          } 
          else 
          {
            clearInterval(interval);
            setFinish(true);
            return 200; // Llega al tamaño 
          }
        });

        setborderRadius((prevSize) => {
          if (prevSize < 300) {
            return prevSize + 2; // Incrementa el tamaño en 2px
          } else {
            clearInterval(interval);
            return 300; // Llega al tamaño de 60px
          }
        });
      }, 50); // Incrementa cada 50ms
    }

    return () => clearInterval(interval); // Limpiar intervalos cuando el componente se desmonta
  }, [expanding]);



 



//////////////////////// 2) MOVIMIENTO BILE /////////////////////

  // KEY: movimiento bolus

  const handleKeyDown = (e: {preventDefault: any; key: string; }) => 
  {
   // if(position.x )
    if (e.key === "ArrowRight") {
      e.preventDefault(); // Prevenir el desplazamiento
      setMoving(true);
      setDirection("right");
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setMoving(true);
      setDirection("left");
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setMoving(true);
      setDirection("up");
    }
    if (e.key === "ArrowDown") {
       e.preventDefault();
      setMoving(true);
      setDirection("down");
    }
  };

  const handleKeyUp = (e: { key: string }) => {
    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    ) {
      setMoving(false);
    }
  };

  useEffect(() => 
  {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // se ejecuta cuando es desmontado o si efecto se vuelve a ejecutar
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Actualiza la posición mientras se está moviendo
  useEffect(() => 
  {
    let interval: any;
    if (moving) {
      interval = setInterval(() => {
        setPosition((prev) => {
          switch (direction) {
            case "right":
              return { ...prev, x: prev.x + 1 };
            case "left":
              return { ...prev, x: prev.x - 1 };
            case "up":
              return { ...prev, y: prev.y - 1 };
            case "down":
              return { ...prev, y: prev.y + 1 };
            default:
              return prev;
          }
        });
      }, 50);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [moving, direction]);



  // MOVIL: movimiento bolus con movil
  const isTouching = useRef(false); // Para controlar si el usuario sigue tocando

  // Función para manejar el inicio del toque
  const handleTouchStart = (e: {TouchEvent:any, preventDefault:any}) => 
  {
    e.preventDefault(); // Prevenir el desplazamiento de la página
    isTouching.current = true;
  };

  // Función para manejar el movimiento del dedo
  const handleTouchMove = (e: React.TouchEvent) => 
  {
    if (containerRef.current) 
    {
      e.preventDefault();
      const container = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0]; // Primer toque
      //console.log(touch.clientX, touch.clientY)

      // Coordenadas relativas al contenedor
      const relativeX = touch.clientX - container.left;
      const relativeY = touch.clientY - container.top;
      
      // Convierte coordenadas relativas en porcentaje con respecto al tamaño del contenedor
      const xPercentage = (relativeX / container.width) * 100;
      const yPercentage = (relativeY / container.height) * 100;
    
      setPosition({ x: xPercentage, y: yPercentage });
      checkOverlap();
    }
  };

  // Función para manejar el fin del toque
  const handleTouchEnd = () => 
  {
    isTouching.current = false; // Finaliza el toque
    document.body.style.overflow = '';
  };



  // MOUSE: movimiento bolus
  const isInteracting = useRef(false); // Controla si el usuario está interactuando

  // Función común para obtener las coordenadas relativas
  const getRelativePosition = (
    clientX: number,
    clientY: number,
    container: DOMRect
  ) => {
    const relativeX = clientX - container.left;
    const relativeY = clientY - container.top;

    const xPercentage = (relativeX / container.width) * 100;
    const yPercentage = (relativeY / container.height) * 100;

    return { x: xPercentage, y: yPercentage };
  };

  // Manejar inicio del toque o clic
  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isInteracting.current = true;
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;

    const { clientX, clientY } = e;
    const { x, y } = getRelativePosition(clientX, clientY, container);
    setPosition({ x, y });
    checkOverlap();
    
  };

  // Manejar movimiento del dedo o ratón
  const handleMove = (e: React.MouseEvent) => 
  {
    if (!isInteracting.current) return;

    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;

    const { clientX, clientY } = e;
    const { x, y } = getRelativePosition(clientX, clientY, container);
    setPosition({ x, y });
    checkOverlap();
  };

  // Finalizar la interacción
  const handleEnd = () => {
    isInteracting.current = false;
  };





  // textos
  const textScience = "The duodenum is the first part of the small intestine and is where the Bile from the Gallbladder mixes with fat..";
  const textGame = "To see how bile emulsifies fat, grab the Bile and touch the fat.";

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
      <BarnerMorado title={'HUMAN BODY: FAT DIGESTION II'}></BarnerMorado>

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
          {finish == true && <PopUpMessage title={"Discover what happens next..."} texto={"Discover how fat (tryglicerides) are broken down."}
                  but1={"GO!"} but2={"" } url1={"../FatDigestion/parte3"} url2={""} />}

          {/* Primera columna - Izquierda */}
          <IzqPurpleMessage scienceText={scienceText}></IzqPurpleMessage>

          


          {/* Segunda columna - Centro */}
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
              h= {{base: "500px", md:"600px"}}
              borderRadius="30px"
              boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"
              style={{
                touchAction: "none", /* Desactiva el desplazamiento táctil */
                overscrollBehavior: "none" /* Prevenir comportamientos adicionales */
              }}
              //movil
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              //raton
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
            >
              <div
                style={{
                  width: "100%", // Contenido interno más ancho que el contenedor
                  height: "100%", // Ocupa toda la altura del card
                  backgroundImage: expanding == false ? `url(${Duodenum.src})` : "",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
              {expanding===true && <div
                style={{
                  position: "absolute",
                  width: "150px", // Contenido interno más ancho que el contenedor
                  height: "150px", // Ocupa toda la altura del card
                  backgroundImage:  `url(${dialogo.src})` ,
                  backgroundSize: "cover",
                  left: screenSize== "xl"? fatPos.x-260 : fatPos.x+10 ,
                  top:  screenSize== "xl"? fatPos.y-50 : fatPos.y+180,
                  display: "flex", // Activar flexbox
                  justifyContent: "center", // Centrar horizontalmente
                  alignItems: "center", // Centrar verticalmente
                  textAlign: "center", // Asegurar que el texto en varias líneas se alinee bien
                }}
              >
                <Text fontFamily="Times New Roman, serif">I'm emulsifying</Text>
              </div>}

              {/* FAT XL */}
              {screenSize!= null && screenSize == "xl" && fatPos.x!= 0 && fatPos.y != 0 &&
               <motion.div
                animate={{
                  left:fatPos.x,
                  top: fatPos.y,
                }}
                transition={{ duration: 1, ease: "easeInOut" }} // Animación suave//
                style={{ position: "absolute"
                
                 }} > 
                 <VStack style={{ display: ver == false? "none": "",  left: expanding == true ? fatPos.x : "", top: expanding == true ? fatPos.y : ""}} >
                  <Box
                    ref={boxRef2}
                    position="relative"
                    boxShadow="0px 4px 8px rgba(0, 0, 0, 0.9)"
                    style={{
                      borderRadius:`${borderRadius}px`,
                      width: `${size}px`, // Utiliza el tamaño actual de state
                      height: `${size}px`, // Lo mismo para height
                      position: "absolute",
                      backgroundImage: `url(${Fat.src})`,
                      backgroundSize: "cover", // Hace que la imagen cubra todo el área
                      backgroundPosition: "center", // Centra la imagen en el card
                      backgroundRepeat: "no-repeat", // Evita que la imagen se repita
                      touchAction: "none", /* Desactiva el desplazamiento táctil */
                      overscrollBehavior: "none", /* Prevenir comportamientos adicionales */
                    }}
                  />
                  <Text position="absolute" color="black" fontFamily="Times New Roman, serif" fontSize="2xl"  textShadow="2px 2px 4px white, -2px -2px 4px white">
                    FAT
                  </Text>
                </VStack> 
              </motion.div> }
              
              {/* FAT sm md*/}
              {screenSize!= null && screenSize !== "xl" && 
              <VStack
                align="center"
                justify="center"
                position="relative" // Esto asegura que se pueda posicionar con respecto al contenedor
                height="100vh" // Asegúrate de que el contenedor ocupe toda la altura de la ventana
                width="100%" // Ocupa el ancho completo
                style={{ left: expanding == true ? fatPos.x : "", top: expanding == true ? fatPos.y : ""}} 
              >
                <Box
                  w="50px"
                  ref={boxRef2}
                  h="50px"
                  position="relative"
                  borderRadius="30px"
                  boxShadow="0px 4px 8px rgba(0.2, 0.2, 0, 1)"
                  style={{
                    borderRadius:`${borderRadius}px`,
                    width: `${size}px`, // Utiliza el tamaño actual de state
                    height: `${size}px`, // Lo mismo para height
                    position: "absolute",
                    backgroundImage: `url(${Fat.src})`,
                    backgroundSize: "cover", // Hace que la imagen cubra todo el área
                    backgroundPosition: "center", // Centra la imagen en el card
                    backgroundRepeat: "no-repeat", // Evita que la imagen se repita
                    touchAction: "none", /* Desactiva el desplazamiento táctil */
                    overscrollBehavior: "none", /* Prevenir comportamientos adicionales */
                  }}
                />
                <Text
                  position="absolute"
                  color="black"
                  fontFamily="Times New Roman, serif"
                  fontSize="2xl"
                  textShadow="2px 2px 4px white, -2px -2px 4px white"
                >
                  FAT
                </Text>
              </VStack>}

              {/* BILE */}
              {expanding == false && 
              <VStack>
                <Box
                  position="absolute"
                  ref={boxRef1}
                  top={`${position.y}%`}
                  left={`${position.x}%`}
                  w="20px"
                  h="20px"
                  bg="green"
                  borderRadius="50%"
                />
                <Text position="absolute" color="green" top={`${position.y + 3}%`} left={`${position.x}%`} fontFamily="Times New Roman, serif">
                  Bile
                </Text>
              </VStack>}  
      
              </div>
            </Card>
          </Flex>


          {/* Tercera columna - Derecha */}
          <DerPurpleMessage gameText={gameText} urlLeft={"../FatDigestion/parte1"} urlRight={"../FatDigestion/parte3"}></DerPurpleMessage>

        </Grid>
      </Flex>
    </Box>
  );
};

export default Parte2FatDigestion;
