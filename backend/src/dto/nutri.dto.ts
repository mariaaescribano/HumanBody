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
	permanente 	= "permanente"
};