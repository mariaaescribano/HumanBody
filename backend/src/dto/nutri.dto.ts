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
	telf: string; 
};

export enum nutriComentarios 
{
    datosFicha	= "datosFicha",	
	prote 		= "prote",	
};