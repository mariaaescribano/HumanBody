'use client';
import React, { useEffect, useState, useRef } from 'react';
import GreenSpinner from '@/components/global/random/GreenSpinner';
import SendMessagePage from '@/components/sendMessage/SendMessagePage';
import { buscaidDiaHoyDePatient, getFecha } from '@/GlobalHelper';

export default function SendMessageFromNutri() 
{
  const [cargado, setcargado] = useState<boolean>(true); // cargar todo el componente 
  const [diaId, setdiaId] = useState<string>(); // dia Id del patient
 
  useEffect(() => 
  {
    const diaHoy = async () =>
    {
      let fechaDeDia = await getFecha();
      let diaHoyDePatient = await buscaidDiaHoyDePatient(fechaDeDia, sessionStorage.getItem("patientTratando"));
      setdiaId(diaHoyDePatient)
    };
    diaHoy()

  }, []);

  return (
    <>
      {diaId!= undefined && 
      <><div style={{ display: cargado == false ? 'none' : "block" }}>
        <SendMessagePage 
            idNutri={sessionStorage.getItem("nutriId")} userNom={sessionStorage.getItem("patientTratando")}
            nutri={true} diaId={diaId}
            cargado={cargado} setcargado={setcargado} // must be spinner until all the messages are on the screen
        />
      </div>
      {cargado == false && <GreenSpinner />}</>}
    </>
  );
}