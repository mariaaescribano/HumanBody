'use client';
import React, { useEffect, useState, useRef } from 'react';
import { designamealSkeleton } from '../../../../../../backend/src/dto/meal.dto';
import LastPagePage from '@/components/designMeal/LastPagePage';
import GreenSpinner from '@/components/global/random/GreenSpinner';

export default function LastPageNutri() 
{
  // todos los meals pero con sus datos para show off
  const [meals, setmeals] = useState<designamealSkeleton[]>([]);
  return (
    <>
      <div style={{ display: meals.length == 0 ? 'none' : "block" }}>
        <LastPagePage meals={meals} setmeals={setmeals} soyNutri={"true"} />
      </div>
      {meals.length == 0 && <GreenSpinner />}
    </>
  );
}