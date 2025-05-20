'use client';
// Chakra imports
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  IconButton,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Image,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
// Custom components
import React, { useEffect, useState, useRef } from 'react';
import { aminoacidBtnNumber, aminoacidBtnText, complexCarbsBtnNumber, complexCarbsBtnText, fiberBtnNumber, fiberBtnText, getTamanyoPantalla, proteinBtnNumber, proteinBtnText, simpleCarbsBtnNumber, simpleCarbsBtnText, typesOfFatBtnNumber, typesOfFatBtnText } from '@/GlobalHelper';
import CustomCard from '@/components/global/cards/CustomCard';
import EBookButton from '@/components/global/random/EBookButton';
import BarraMenu from '@/components/global/BarraMenu';

export default function ebookOverView() {

  return (
    <Flex
            direction="column"
            align="center"
            bg="purple.100"
            w="100%"
            h="100%"
            justify="center"
            p="20px"
            minH="100vh"
            position={"relative"}
        >
             <BarraMenu></BarraMenu>
            <CustomCard hijo={
                <Flex flexDirection={"column"} w="100%" gap={"10px"}>
                    <EBookButton texto={proteinBtnText} type={proteinBtnNumber}></EBookButton>
                    <EBookButton texto={aminoacidBtnText} type={aminoacidBtnNumber}></EBookButton>
                    <EBookButton texto={typesOfFatBtnText} type={typesOfFatBtnNumber}></EBookButton>
                    <EBookButton texto={complexCarbsBtnText} type={complexCarbsBtnNumber}></EBookButton>
                    <EBookButton texto={simpleCarbsBtnText} type={simpleCarbsBtnNumber}></EBookButton>
                    <EBookButton texto={fiberBtnText} type={fiberBtnNumber}></EBookButton>
                </Flex>} >
            </CustomCard>
          </Flex>
    );
}
