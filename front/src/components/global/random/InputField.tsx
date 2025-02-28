'use client'
// Chakra imports
import { Flex, FormLabel, Input, Text, useColorModeValue } from '@chakra-ui/react';
import MeryTooltip from './MeryToolTip';

// Custom components

export default function InputField(props: {
	id?: string;
	label?: string;
	extra?: JSX.Element;
	placeholder?: string;
	type?: string;
	toolTipText?:string;
	mb?:string;
	disabled?:boolean;
	[x: string]: any;
}) {
	const { id, label, extra, placeholder, type, toolTipText, mb, ...rest } = props;
	// Chakra Color Mode
	const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');

	return (
		<Flex direction='column' mb={mb ? mb : '30px'}>
			<FormLabel
				display='flex'
				ms='10px'
				fontSize='sm'
				color={textColorPrimary}
				fontWeight='bold'
				_hover={{ cursor: 'pointer' }}>
				{label}
				<Text fontSize='sm' fontWeight='400' ms='2px'>
					{extra}
				</Text>
				{toolTipText != null && <MeryTooltip texto={toolTipText}></MeryTooltip>}
			</FormLabel>
			<Input
				{...rest}
				type={type}
				id={id}
				disabled={props.disabled}
                border="1px solid gray"
                borderRadius={"10px"}
				fontWeight='500'
				variant='main'
				placeholder={placeholder}
				_placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
				h='44px'
				maxH='44px'
			/>
		</Flex>
	);
}
