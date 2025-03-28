import { reciboSkeleton } from "./recibos.dto";

export interface mealSkeleton 
{
    relleno:boolean;
    caloriasTotal:string;
    caloriasSelected:string;

    proteTotal:string;
    fuenteProte:string;
    gramosFuenteProte:string;

    carbsTotal:string;
    fuenteCarbs:string;
    gramosFuenteCarbs:string;

    fatTotal:string;
    fuenteFat:string;
    gramosFuenteFat:string;

    fibraTotal:string;
    fuenteFibra:string;
    gramosFuenteFibra:string;
};


export interface alimentoMacroMealView 
{
    recibo?: reciboSkeleton;
    nombreFuente:string;
    gramosMacro:string;
    calorias?:string;
    gramosFuente:string;
};

export interface selectedAlimentosSkeleton 
{
    prote:string;
    fats:string;
    carbs:string;
    fiber:string;

    proteTotal:string;
    fatsTotal:string;
    carbsTotal:string;
    fiberTotal:string;

    proteGrams:string;
    fatsGrams:string;
    carbsGrams:string;
    fiberGrams:string;
};

export interface finalMealCard
{
    prote:alimentoMacroMealView;
    fats:alimentoMacroMealView;
    carbs:alimentoMacroMealView;
    fiber:alimentoMacroMealView;
    pieData:number[];
    totalCalories:string;
};


export interface designamealSkeleton 
{
    idDia: number;
    meal:number;
    nomUser:string;
    
    caloriasTotal:string;
    caloriasSelected:string;

    proteTotal:string;
    fuenteProte:string;
    gramosFuenteProte:string;

    carbsTotal:string;
    fuenteCarbs:string;
    gramosFuenteCarbs:string;

    fatTotal:string;
    fuenteFat:string;
    gramosFuenteFat:string;

    fibraTotal:string;
    fuenteFibra:string;
    gramosFuenteFibra:string;
};