import { Container, VStack, SimpleGrid, Box, Text, HStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import ArtCard from '../components/ArtCard'
import MarketCard from '../components/MarketCard'
import { useArt } from '../store/arts'

const HostHomePage = () => {

    const {fetchHostGallery, hostGallery, fetchInfo, daoInfo} = useArt();
    console.log(hostGallery.data);
    
    useEffect(() => {
        fetchHostGallery();
        fetchInfo();
    }, [fetchHostGallery, fetchInfo])
       
    
    // Check if arts array is populated before rendering AccountCard
    const isArtsLoaded = hostGallery.length > 0;

  return (
        <Container maxW='container.xl' py={12} >
        <VStack>
        <Text fontSize="4xl" fontWeight="extrabold" textAlign="center" fontStyle="italic" fontFamily="'DM Serif Display', serif" letterSpacing="wide">Host Art Gallery</Text>

        <HStack spacing={10} w={"full"}>
            <SimpleGrid columns={3} spacing={10} w={"80%"} padding={"5"} paddingRight={"8"} bg={"whiteAlpha.600"} borderRadius={"10px"} border={"2px"} borderColor={"Black"}>
            {hostGallery.map((art) => (
                <ArtCard key={art._id} art={art}/>
            ))}
            </SimpleGrid>
            {isArtsLoaded && (
            <Box w={"20%"} display={"flex"} flexDirection={"column"} alignItems={"flex-start"} mb={"auto"}>
                <MarketCard daoInfo={daoInfo} />
            </Box>
            )}
        </HStack>
        </VStack>
    </Container>
  )
}

export default HostHomePage