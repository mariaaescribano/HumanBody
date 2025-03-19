'use client';
// Chakra imports
import { Box, Avatar, Text, Input } from '@chakra-ui/react';
import CustomCard from '../global/cards/CustomCard';
import PencilIconOnTop from '../icons/PencilIconOnTop';
import { useEffect, useRef, useState } from 'react';

export default function AvatarPart(props: {function:any, subiendo:number, setEmpezarAEditar:any, editando:boolean, 
  nom:string, setnewUserNom:any,
  setperfilPic:any, perfilPic:string} ) 
{
  const [photo, setPhoto] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => 
  {
    if(props.perfilPic != null)
    {
      setPhoto(props.perfilPic)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.perfilPic]);

  
  const handleOpenFileExplorer = () => {
    if (props.editando == true) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(props.editando==true)
    {
      const files = event.target.files;
      if (files && files.length > 0) 
      {
        const file = files[0];
        const reader = new FileReader();
        if (file) {
          props.setperfilPic(file); 
        }

        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          setPhoto(imageUrl);
        };

        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <Box position="relative" w="100%" display="flex" justifyContent="center">
      <CustomCard mt="20px" hijo={ 
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar src={photo} size="xl" onClick={handleOpenFileExplorer} cursor={props.editando == true ? "pointer" : "default"} />
          {props.editando == false && <Text mt="10px" textAlign="center" fontWeight="bold">{props.nom}</Text>}
          {props.editando == true &&<Input mt="10px" defaultValue={props.nom} textAlign={"center"} 
          onChange={(e) => props.setnewUserNom(e.target.value)}></Input>}
        </Box>
      } />

      <Box mt={"5px"}>  
        <PencilIconOnTop subiendo={props.subiendo} setEmpezarAEditar={props.setEmpezarAEditar} editando={props.editando} function={props.function}  />
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }} // Oculta el input de tipo "file"
        onChange={handleFileChange}
      />
     
    </Box>
  );
}
