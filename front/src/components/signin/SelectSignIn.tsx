'use client';
import { StringIsNull } from '../../GlobalHelper';
import { Flex, FormLabel, Select, useColorModeValue, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { exerciseFrequencyList, objectivesList } from '../../GlobalHelper';

/* 0-peso
1-altura
2-objetivo
3-estilo de vida */

  

const ageRange = [
    { value: '12', label: '12 years' },
    { value: '13', label: '13 years' },
    { value: '14', label: '14 years' },
    { value: '15', label: '15 years' },
    { value: '16', label: '16 years' },
    { value: '17', label: '17 years' },
    { value: '18', label: '18 years' },
    { value: '19', label: '19 years' },
    { value: '20', label: '20 years' },
    { value: '21', label: '21 years' },
    { value: '22', label: '22 years' },
    { value: '23', label: '23 years' },
    { value: '24', label: '24 years' },
    { value: '25', label: '25 years' },
    { value: '26', label: '26 years' },
    { value: '27', label: '27 years' },
    { value: '28', label: '28 years' },
    { value: '29', label: '29 years' },
    { value: '30', label: '30 years' },
    { value: '31', label: '31 years' },
    { value: '32', label: '32 years' },
    { value: '33', label: '33 years' },
    { value: '34', label: '34 years' },
    { value: '35', label: '35 years' },
    { value: '36', label: '36 years' },
    { value: '37', label: '37 years' },
    { value: '38', label: '38 years' },
    { value: '39', label: '39 years' },
    { value: '40', label: '40 years' },
    { value: '41', label: '41 years' },
    { value: '42', label: '42 years' },
    { value: '43', label: '43 years' },
    { value: '44', label: '44 years' },
    { value: '45', label: '45 years' },
    { value: '46', label: '46 years' },
    { value: '47', label: '47 years' },
    { value: '48', label: '48 years' },
    { value: '49', label: '49 years' },
    { value: '50', label: '50 years' },
    { value: '51', label: '51 years' },
    { value: '52', label: '52 years' },
    { value: '53', label: '53 years' },
    { value: '54', label: '54 years' },
    { value: '55', label: '55 years' },
    { value: '56', label: '56 years' },
    { value: '57', label: '57 years' },
    { value: '58', label: '58 years' },
    { value: '59', label: '59 years' },
    { value: '60', label: '60 years' },
];

const pesos = [
    { value: '40', label: '40 kg' },
    { value: '41', label: '41 kg' },
    { value: '42', label: '42 kg' },
    { value: '43', label: '43 kg' },
    { value: '44', label: '44 kg' },
    { value: '45', label: '45 kg' },
    { value: '46', label: '46 kg' },
    { value: '47', label: '47 kg' },
    { value: '48', label: '48 kg' },
    { value: '49', label: '49 kg' },
    { value: '50', label: '50 kg' },
    { value: '51', label: '51 kg' },
    { value: '52', label: '52 kg' },
    { value: '53', label: '53 kg' },
    { value: '54', label: '54 kg' },
    { value: '55', label: '55 kg' },
    { value: '56', label: '56 kg' },
    { value: '57', label: '57 kg' },
    { value: '58', label: '58 kg' },
    { value: '59', label: '59 kg' },
    { value: '60', label: '60 kg' },
    { value: '61', label: '61 kg' },
    { value: '62', label: '62 kg' },
    { value: '63', label: '63 kg' },
    { value: '64', label: '64 kg' },
    { value: '65', label: '65 kg' },
    { value: '66', label: '66 kg' },
    { value: '67', label: '67 kg' },
    { value: '68', label: '68 kg' },
    { value: '69', label: '69 kg' },
    { value: '70', label: '70 kg' },
    { value: '71', label: '71 kg' },
    { value: '72', label: '72 kg' },
    { value: '73', label: '73 kg' },
    { value: '74', label: '74 kg' },
    { value: '75', label: '75 kg' },
    { value: '76', label: '76 kg' },
    { value: '77', label: '77 kg' },
    { value: '78', label: '78 kg' },
    { value: '79', label: '79 kg' },
    { value: '80', label: '80 kg' },
    { value: '81', label: '81 kg' },
    { value: '82', label: '82 kg' },
    { value: '83', label: '83 kg' },
    { value: '84', label: '84 kg' },
    { value: '85', label: '85 kg' },
    { value: '86', label: '86 kg' },
    { value: '87', label: '87 kg' },
    { value: '88', label: '88 kg' },
    { value: '89', label: '89 kg' },
    { value: '90', label: '90 kg' }
    ];


const alturas = [
    { value: '145', label: '145 cm' },
    { value: '146', label: '146 cm' },
    { value: '147', label: '147 cm' },
    { value: '148', label: '148 cm' },
    { value: '149', label: '149 cm' },
    { value: '150', label: '150 cm' },
    { value: '151', label: '151 cm' },
    { value: '152', label: '152 cm' },
    { value: '153', label: '153 cm' },
    { value: '154', label: '154 cm' },
    { value: '155', label: '155 cm' },
    { value: '156', label: '156 cm' },
    { value: '157', label: '157 cm' },
    { value: '158', label: '158 cm' },
    { value: '159', label: '159 cm' },
    { value: '160', label: '160 cm' },
    { value: '161', label: '161 cm' },
    { value: '162', label: '162 cm' },
    { value: '163', label: '163 cm' },
    { value: '164', label: '164 cm' },
    { value: '165', label: '165 cm' },
    { value: '166', label: '166 cm' },
    { value: '167', label: '167 cm' },
    { value: '168', label: '168 cm' },
    { value: '169', label: '169 cm' },
    { value: '170', label: '170 cm' },
    { value: '171', label: '171 cm' },
    { value: '172', label: '172 cm' },
    { value: '173', label: '173 cm' },
    { value: '174', label: '174 cm' },
    { value: '175', label: '175 cm' },
    { value: '176', label: '176 cm' },
    { value: '177', label: '177 cm' },
    { value: '178', label: '178 cm' },
    { value: '179', label: '179 cm' },
    { value: '180', label: '180 cm' },
    { value: '181', label: '181 cm' },
    { value: '182', label: '182 cm' },
    { value: '183', label: '183 cm' },
    { value: '184', label: '184 cm' },
    { value: '185', label: '185 cm' },
    { value: '186', label: '186 cm' },
    { value: '187', label: '187 cm' },
    { value: '188', label: '188 cm' },
    { value: '189', label: '189 cm' },
    { value: '190', label: '190 cm' }
  ];

  const genero = [
    { value: 'Woman', label: 'Woman' },
    { value: 'Man', label: 'Man' },
  ];
  


export default function SelectSignIn(props: { type:number, selectedValue:string, setSelected: React.Dispatch<React.SetStateAction<any>> }) 
{
    const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
    const [options, setOption] = useState<any>([]);
    const title = useRef<string>("");

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => 
    {
        props.setSelected(event.target.value);
    };


    const handlePonerRecuperarDatos = (lista: any) => {
        setOption(lista);
        if (!StringIsNull(props.selectedValue)) {
          const index = lista.findIndex((item: any) => item.value === props.selectedValue);
          if (index !== -1) {
            props.setSelected(lista[index].value);
          } else {
            props.setSelected(lista[0].value);
          }
        } else {
          props.setSelected(lista[0].value);
        }
      };


    useEffect(() => 
    {
        if(!StringIsNull(props.type.toString()))
        {
            if(props.type == 0)
            {
                handlePonerRecuperarDatos(pesos)
                title.current = "Weigth"  
            }   
            if(props.type == 1)
            {
                handlePonerRecuperarDatos(alturas)
                title.current = "Height"    
            } 
            if(props.type == 2)
                {
                    handlePonerRecuperarDatos(objectivesList)
                    title.current = "Actual objective"    
                } 
                if(props.type == 3)
                    {
                        handlePonerRecuperarDatos(exerciseFrequencyList)
                        title.current = "Exercise frequency"    
                    } 
                    if(props.type == 4)
                        {
                            handlePonerRecuperarDatos(genero)
                            title.current = "Gender"    
                        } 
                        if(props.type == 5)
                            {
                                handlePonerRecuperarDatos(ageRange)
                                title.current = "Age"    
                            }  
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.type]);

    return (
    <>
       { options.length > 0 && !StringIsNull(props.selectedValue) && 
            <Flex direction="column" mb="4px">
               <FormLabel
                    display='flex'
                    ms='10px'
                    fontSize='sm'
                    color={textColorPrimary}
                    fontWeight='bold'
                    _hover={{ cursor: 'pointer' }}>
                    <Text fontSize='sm' ms='2px'fontWeight="bold">
                        {title.current}
                    </Text>
                </FormLabel>
                
                <Select
                fontSize="sm"
                border="1px solid gray"
                borderRadius={"10px"}
                variant="main"
                h="44px"
                maxH="44px"
                value={props.selectedValue || ""}
                onChange={handleSelectChange}  
                >
                    {options.map((option:any) => (
                        <option key={option.value} value={option.value}>
                        {option.label}
                        </option>
                    ))}
                </Select>
            </Flex>}
    </>
  );
}
