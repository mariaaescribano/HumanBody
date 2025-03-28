'use client';
import React, { useEffect, useState, useRef } from 'react';
import GreenSpinner from '@/components/global/random/GreenSpinner';
import FoodListContent from '@/components/foodList/FoodListContent';
import { alimentosComidosSkeleton } from '../../../../../../backend/src/dto/alimentos.dto';

export default function NutritionistFoodList() 
{
  const [alimentos, setalimentos ] = useState<alimentosComidosSkeleton[]>();

  return (
    <>
      {<FoodListContent alimentos={alimentos} setalimentos={setalimentos}></FoodListContent>}
      {!alimentos && <GreenSpinner></GreenSpinner>}
    </>);

}
