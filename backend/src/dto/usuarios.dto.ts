// para crear usuario en bd (se registra por 1 vez)
export interface createUserSkeleton 
{
    nombre:string;
    contra:string;
    peso:string;
    altura:string;
    nivel_actividad:string;
    calorias_objetivo:string;
    objetivo:string;
    recibo:number; //tiene asociado un Recibo como objetivos tangibles
    genero:string;
    edad:string;
};

export interface realUser 
{
    nombre:string;
    contra:string;
    dias_ids:string; 
    ficha_id:string; 
    fecha_registro:string; 

};