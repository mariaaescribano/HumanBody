export interface nutricomentarios 
{
    idNutri: number;
	idPatient: number;
	datosFicha: string; 	
	prote: string; 
};

export interface nutriPerfil 
{
    id: number;
	nom: string;
	perfilPic: string; 	
	description: string; 
	email: string; 
};

export enum nutriComentarios 
{
    datosFicha	= "datosFicha",	
	prote 		= "prote",
	fats 		= "fats",		
	carbs 		= "carbs",	
	fibra 		= "fibra",	
	proteMyDay 	= "proteMyDay",
	fatsMyDay 	= "fatsMyDay",		
	carbsMyDay 	= "carbsMyDay",	
	fibraMyDay	= "fibraMyDay",
	myday 		= "myday",
	permanente 	= "permanente",
	nutriRecomienda  = "nutriRecomienda" // string of alimentosComidos_ids concatenated with ,
};

export interface patientSkeleton 
{
    id: number;
	nombre: string;
	dias_ids: string; 	
	ficha_id: string; 
	fecha_registro: string;
	nutritionist: string;
	peso: string; 	
	altura: string; 
	actividad: string; 
	calorias_objetivo: string;
	objetivo: string; 	
	recibo_id: string; 
	genero: string;  
	edad: string; 	
	fidelitytomyself_id: string; 
	alimentos_fav_id: string; 
	perfilPic: string;
};