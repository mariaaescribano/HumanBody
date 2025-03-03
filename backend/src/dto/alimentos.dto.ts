
export interface alimentosSkeleton 
{
    id?:string;
    nombre:string;
    calorias_100gr:string;
    gramos:string;
    recibo_id:number;
    predomina:number; // 0-prote, 1-fats, 2-carbs
    es_fav_deUsu?:boolean;
};

export interface miniCartaAlimento 
{
    id:number;
    nombre:string;
    predomina:number;
    calorias_100gr:string;
    es_fav_deUsu?:boolean;
};