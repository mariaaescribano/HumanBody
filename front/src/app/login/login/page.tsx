'use client';
// Chakra imports
import {
  Box,
  Button,
  Card,
  Flex,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components

import React, { useEffect, useRef, useState } from 'react';
import { API_URL, StringIsNull } from '../../../../GlobalHelper';
import PopUpErrorMessage from '@/components/global/message/PopUpErrorMessage';
import InputField from '@/components/global/random/InputField';


export default function login() 
{
  const textColor = useColorModeValue('secondaryGray.900', 'white'); 
  const [nom, setnom] = useState<string>("");
  const [contra, setcontra] = useState<string>("");

  // si alguno esta mal
  // 1- no nombre, 2- no contra, 3- ninguno
  const [datosMal, setdatosMal] = useState<number>(0);

  // gestionar errores del back
  const [hayError, sethayError] = useState<boolean>(false);
  const errorText = useRef<string>("");

  // pulsado boton y se esta haciendo llamada al back
  const [btnPulsado, setbtnPulsado] = useState<boolean>(false);



  useEffect(() => {
    const nomInput = document.getElementById("first") as HTMLInputElement;
    const contraInput = document.getElementById("last") as HTMLInputElement;

    if (nomInput) setnom(nomInput.value);
    if (contraInput) setcontra(contraInput.value);
  }, []);


  const existeUser = async () => 
  {
    setbtnPulsado(true);

    const isNomEmpty = StringIsNull(nom);
    const isContraEmpty = StringIsNull(contra);
  
    if (isNomEmpty && isContraEmpty) {
      setbtnPulsado(false);
      return setdatosMal(3);
    }
    if (isNomEmpty) {
      setbtnPulsado(false);
      return setdatosMal(1);
    }
    if (isContraEmpty) {
      setbtnPulsado(false);
      return setdatosMal(2);
    }
    
  
    try {
      const response = await axios.post(
        `${API_URL}/usuarios/login`,
        { nom, pass: contra },
        { headers: { "Content-Type": "application/json" } }
      );
  
      setbtnPulsado(false);
  
      if (response.data?.exists) {
        sessionStorage.clear();
        sessionStorage.setItem("userNom", nom);
        location.href = "../../myday"
      } else {
        errorText.current = "User doesn't exist";
        sethayError(true);
        setdatosMal(3);
      }
    } 
    catch (error: any) 
    {
      setbtnPulsado(false);
      sethayError(true);
  
      if (!error.response) {
        errorText.current = "Network error, please check your connection";
      } else if (error.response.status === 404) {
        setdatosMal(3);
        errorText.current = "Wrong password or user name";
      } else if (error.response.status === 500) {
        errorText.current = "Please, try again later";
      } else {
        setdatosMal(3);
        errorText.current = "User doesn't exist";
      }
    }
  };

  return (
    <Flex
        direction="column"
        align="center"
        bg="purple.100"
        w="100%"
        h="100%"
        justify="center"
        minH="100vh"
        position={"relative"}
    >
        {hayError == true && <PopUpErrorMessage cancel={hayError} setCancel={sethayError} title={'Error'} texto={errorText.current} ></PopUpErrorMessage>}
        
        
        <Card p="30px" width={{base:"80%", md: "100%"}} maxWidth={"500px"} mt="90px" align="center" justify="center" borderRadius={"20px"}>
            <Text color={textColor} fontSize="2xl" fontWeight="700" mb="20px">
            LOG IN
            </Text>
            <Flex direction="column" w="100%">
            <Stack direction="column" spacing="20px">
                <SimpleGrid columns={{ base: 1, md: 1 }} gap="20px">
                <InputField
                    mb="0px"
                    id="first"
                    value={nom}
                    bg={datosMal==1 || datosMal == 3 ? "red.200": ""}
                    placeholder="eg. Esthera"
                    label="User name"
                    onChange={(e:any) => setnom(e.target.value)}
                />
                <InputField
                    mb="0px"
                    id="last"
                    bg={datosMal==2 || datosMal == 3 ? "red.200": ""}
                    type="password"
                    placeholder="eg. ****"
                    label="Password"
                    value={contra}
                    onChange={(e:any) => setcontra(e.target.value)}
                />
                </SimpleGrid>
            </Stack>
            <Flex justify="space-between" mt="24px">
                <Button
                variant="darkBrand"
                fontSize="sm"
                borderRadius="16px"
                bg="purple.100"
                w={{ base: '128px', md: '148px' }}
                h="46px"
                disabled={btnPulsado}
                ms="auto"
                _hover={{bg:"gray.100"}}
                onClick={existeUser}
                >
                Next
                {btnPulsado==true && (
                  <Spinner
                    size="sm"
                    ml={4}
                    color="white"
                  />
                )}
                </Button>
            </Flex>


            <Link href="../login/signup/parte1" w="150px">
              <Text color="purple.300" as="span" cursor="pointer">
                Not registered yet?
              </Text>
            </Link>
            
            </Flex>
        </Card>
    </Flex>);

//   return (
//     <Flex
//       direction="column"
//       minH="100vh"
//       align="center"
      
//       pt={{ sm: '125px', lg: '75px' }}
//       position="relative"
//     >
//       <Box
//         h="45vh"
//         bgGradient="linear(to-b, brand.400, brand.600)"
//         position="absolute"
//         w="100%"
//         borderRadius="30px"
//       />

//       <Tabs
//         variant="unstyled"
//         zIndex="0"
//         mt={{ base: '60px', md: '165px' }}
//         display="flex"
//         flexDirection="column"
//       >
//         <TabList
//           display="flex"
//           alignItems="center"
//           alignSelf="center"
//           justifySelf="center"
//         >
//           <Tab
//             _focus={{ border: '0px', boxShadow: 'unset' }}
//             w={{ sm: '120px', md: '250px', lg: '300px' }}
//             onClick={() =>
//               setActiveBullets({
//                 user: true,
//                 address: false,
//                 profile: false,
//               })
//             }
//           >
//             <Flex
//               direction="column"
//               justify="center"
//               align="center"
//               position="relative"
//               _before={{
//                 content: "''",
//                 width: { sm: '120px', md: '250px', lg: '300px' },
//                 height: '3px',
//                 bg: activeBullets.address ? 'white' : 'brand.400',
//                 left: { sm: '12px', md: '30px' },
//                 // top: {
//                 //   sm: activeBullets.user ? '6px' : '4px',
//                 //   md: null,
//                 // },
//                 position: 'absolute',
//                 bottom: activeBullets.user ? '40px' : '38px',

//                 transition: 'all .3s ease',
//               }}
//             >
//               <Box
//                 zIndex="1"
//                 border="2px solid"
//                 borderColor={activeBullets.user ? 'white' : 'brand.400'}
//                 bgGradient="linear(to-b, brand.400, brand.600)"
//                 w="16px"
//                 h="16px"
//                 mb="8px"
//                 borderRadius="50%"
//               />
//               <Text
//                 color={activeBullets.user ? 'white' : 'gray.300'}
//                 fontWeight={activeBullets.user ? 'bold' : 'normal'}
//                 display={{ sm: 'none', md: 'block' }}
//               >
//                 User Info
//               </Text>
//             </Flex>
//           </Tab>
//           <Tab
//             _focus={{ border: '0px', boxShadow: 'unset' }}
//             // ref={addressTab}
//             w={{ sm: '120px', md: '250px', lg: '300px' }}
//             onClick={() =>
//               setActiveBullets({
//                 user: true,
//                 address: true,
//                 profile: false,
//               })
//             }
//           >
//             <Flex
//               direction="column"
//               justify="center"
//               align="center"
//               position="relative"
//               _before={{
//                 content: "''",
//                 width: { sm: '120px', md: '250px', lg: '300px' },
//                 height: '3px',
//                 bg: activeBullets.profile ? 'white' : 'brand.400',
//                 left: { sm: '12px', md: '32px' },
//                 top: '6px',
//                 position: 'absolute',
//                 bottom: activeBullets.address ? '40px' : '38px',

//                 transition: 'all .3s ease',
//               }}
//             >
//               <Box
//                 zIndex="1"
//                 border="2px solid"
//                 borderColor={activeBullets.address ? 'white' : 'brand.400'}
//                 bgGradient="linear(to-b, brand.400, brand.600)"
//                 w="16px"
//                 h="16px"
//                 mb="8px"
//                 borderRadius="50%"
//               />
//               <Text
//                 color={activeBullets.address ? 'white' : 'gray.300'}
//                 fontWeight={activeBullets.address ? 'bold' : 'normal'}
//                 display={{ sm: 'none', md: 'block' }}
//               >
//                 Address
//               </Text>
//             </Flex>
//           </Tab>
//           <Tab
//             _focus={{ border: '0px', boxShadow: 'unset' }}
//             // ref={profileTab}
//             w={{ sm: '120px', md: '250px', lg: '300px' }}
//             onClick={() =>
//               setActiveBullets({
//                 user: true,
//                 address: true,
//                 profile: true,
//               })
//             }
//           >
//             <Flex
//               direction="column"
//               justify="center"
//               align="center"
//               position="relative"
//             >
//               <Box
//                 zIndex="1"
//                 border="2px solid"
//                 borderColor={activeBullets.profile ? 'white' : 'brand.400'}
//                 bgGradient="linear(to-b, brand.400, brand.600)"
//                 w="16px"
//                 h="16px"
//                 mb="8px"
//                 borderRadius="50%"
//               />
//               <Text
//                 color={activeBullets.profile ? 'white' : 'gray.300'}
//                 fontWeight={activeBullets.profile ? 'bold' : 'normal'}
//                 display={{ sm: 'none', md: 'block' }}
//               >
//                 Profile
//               </Text>
//             </Flex>
//           </Tab>
//         </TabList>



//         {/* por puntos */}
//         <TabPanels mt="24px" maxW={{ md: '90%', lg: '100%' }} mx="auto">
//           <TabPanel
//             w={{ sm: '330px', md: '700px', lg: '850px' }}
//             p="0px"
//             mx="auto"
//           >
//             <Card p="30px">
//               <Text color={textColor} fontSize="2xl" fontWeight="700" mb="20px">
//                 User Info
//               </Text>
//               <Flex direction="column" w="100%">
//                 <Stack direction="column" spacing="20px">
//                   <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px">
//                     <InputField
//                       mb="0px"
//                       id="first"
//                       placeholder="eg. Esthera"
//                       label="First Name"
//                     />
//                     <InputField
//                       mb="0px"
//                       id="last"
//                       placeholder="eg. Peterson"
//                       label="Last Name"
//                     />
//                     <InputField
//                       mb="0px"
//                       id="Company"
//                       placeholder="eg. Simmmple"
//                       label="Company"
//                     />
//                     <InputField
//                       mb="0px"
//                       id="Email"
//                       placeholder="eg. hello@simmmple.com"
//                       label="Email Address"
//                     />
//                     <InputField
//                       mb="0px"
//                       id="Password"
//                       placeholder="4030120241"
//                       label="Password"
//                     />
//                     <InputField
//                       mb="0px"
//                       id="Confirm"
//                       placeholder="4030120241"
//                       label="Confirm Password"
//                     />
//                   </SimpleGrid>
//                 </Stack>
//                 <Flex justify="space-between" mt="24px">
//                   <Button
//                     variant="darkBrand"
//                     fontSize="sm"
//                     borderRadius="16px"
//                     w={{ base: '128px', md: '148px' }}
//                     h="46px"
//                     ms="auto"
//                     // onClick={() => addressTab.current.click()}
//                   >
//                     Next
//                   </Button>
//                 </Flex>
//               </Flex>
//             </Card>
//           </TabPanel>
//           <TabPanel
//             w={{ sm: '330px', md: '700px', lg: '850px' }}
//             p="0px"
//             mx="auto"
//           >
//             <Card p="30px" >
//               <Text color={textColor} fontSize="2xl" fontWeight="700" mb="20px">
//                 Address
//               </Text>
//               <Flex direction="column" w="100%">
//                 <Stack direction="column" spacing="20px" mb="20px">
//                   <InputField
//                     mb="0px"
//                     id="add1"
//                     placeholder="eg. Main Street 203"
//                     label="Address Line 1"
//                   />
//                   <InputField
//                     mb="0px"
//                     id="add2"
//                     placeholder="eg. Apartment, Floor"
//                     label="Address Line 2"
//                   />
//                   <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px">
//                     <InputField
//                       mb="0px"
//                       id="city"
//                       placeholder="eg. Miami"
//                       label="City"
//                     />
//                     <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px">
//                       <InputField
//                         mb="0px"
//                         id="add2"
//                         placeholder="Florida"
//                         label="State"
//                       />
//                       <InputField
//                         mb="0px"
//                         id="zip"
//                         placeholder="eg. Apartment, Floor"
//                         label="ZIP"
//                       />
//                     </SimpleGrid>
//                   </SimpleGrid>
//                 </Stack>
//                 <Flex justify="space-between">
//                   <Button
//                     variant="light"
//                     fontSize="sm"
//                     borderRadius="16px"
//                     w={{ base: '128px', md: '148px' }}
//                     h="46px"
//                     // onClick={() => userTab.current.click()}
//                   >
//                     Prev
//                   </Button>
//                   <Button
//                     variant="darkBrand"
//                     fontSize="sm"
//                     borderRadius="16px"
//                     w={{ base: '128px', md: '148px' }}
//                     h="46px"
//                     ms="auto"
//                     // onClick={() => profileTab.current.click()}
//                   >
//                     Next
//                   </Button>
//                 </Flex>
//               </Flex>
//             </Card>
//           </TabPanel>
//           <TabPanel
//             w={{ sm: '330px', md: '700px', lg: '850px' }}
//             p="0px"
//             mx="auto"
//           >
//             <Card p="30px">
//               <Text color={textColor} fontSize="2xl" fontWeight="700" mb="20px">
//                 Profile
//               </Text>
//               <Flex direction="column" w="100%">
//                 <Stack direction="column" spacing="20px">
//                   <InputField
//                     id="profile email"
//                     placeholder="Your primary email address"
//                     label="Profile Email"
//                     mb="0px"
//                   />
//                   <Text
//                     minH="150px"
//                     id="bio"
            
                
//                   />
//                 </Stack>
//                 <Flex justify="space-between" mt="24px">
//                   <Button
//                     variant="light"
//                     fontSize="sm"
//                     borderRadius="16px"
//                     w={{ base: '128px', md: '148px' }}
//                     h="46px"
//                     // onClick={() => addressTab.current.click()}
//                   >
//                     Prev
//                   </Button>
//                   <Button
//                     variant="darkBrand"
//                     fontSize="sm"
//                     borderRadius="16px"
//                     w={{ base: '128px', md: '148px' }}
//                     h="46px"
//                   >
//                     Submit
//                   </Button>
//                 </Flex>
//               </Flex>
//             </Card>
//           </TabPanel>
//         </TabPanels>




//       </Tabs>
//     </Flex>
//   );





}
