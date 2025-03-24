import { Button, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { nutriPerfil } from "../../../../backend/src/dto/nutri.dto";
import { API_URL, colorNutricionist, colorNutricionistBg } from "@/GlobalHelper";
import axios from "axios";

const PopUpConfirmationMessage = (props: {selectedNutri:nutriPerfil, setselectedNutri:any, prepara:any}) => 
{
    const [loading, setloading] = useState<boolean>(false);
    const [text, settext] = useState<string>();

    const enviarSolicitud = async () =>
    {
        setloading(true)
        try
        {
            const response = await axios.put(
            `${API_URL}/nutritionist/solicitudDeContrato/${sessionStorage.getItem("userNom")}/${props.selectedNutri.id}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if(response.data.result == true)
            {
                settext("Notification sent successfully")
            }
        }
        catch (error) {
            console.log('Error fetching data:', error);
        }
        finally {
            setloading(false);
        }
    };

    return (
    <>
        {props.selectedNutri && (
        <>
            {/* Dark overlay to freeze background */}
            <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 20
            }}
            ></div>

            {/* Popup content */}
            <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: colorNutricionistBg,
                color: "black",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                zIndex: 1000, // Pop-up is above the overlay
            }}
            >
            <p>{text == undefined ? "Do you want to send a notification to "+ props.selectedNutri.nom + " to hire him/her as a nutritionist?": text}</p>
           
            
            {text == undefined ? 
            <HStack justify="center" align="center" spacing="20px" mt="10px">
                <Button bg={colorNutricionist} onClick={enviarSolicitud} disabled={loading} >
                    <HStack>
                        <Text>Proceed</Text>
                        {loading == true && 
                        <Spinner
                            size="sm"
                            ml={4}
                            color="white"
                        />}
                    </HStack>
                </Button>
                <Button bg={colorNutricionist} disabled={loading} onClick={() => props.setselectedNutri(undefined)}>
                    {"Cancel"}
                </Button>
            </HStack>
            :
            <VStack justify="center" align="center" spacing="20px" mt="10px">
                 {text != undefined && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg>} 
                <Button bg={colorNutricionist} onClick={() =>{ props.setselectedNutri(undefined); props.prepara();}}>
                    {"Ok"}
                </Button>
            </VStack>
            }
            </div>
        </>
        )}
    </>
    );
};

export default PopUpConfirmationMessage;
