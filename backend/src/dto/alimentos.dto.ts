
export interface alimentosSkeleton 
{
    nombre:string;
    calorias_100gr:string;
    gramos:string;
    recibo_id:number;
    predomina:number; // 0-prote, 1-fats, 2-carbs
};

export interface miniCartaAlimento 
{
    nombre:string;
    predomina:number;
    calorias_100gr:string;
};