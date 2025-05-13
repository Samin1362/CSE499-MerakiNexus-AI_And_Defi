import { Container, VStack, SimpleGrid, Box, Text, HStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import ArtCard from '../components/ArtCard'
import MarketCard from '../components/MarketCard'
import { useArt } from '../store/arts'
import AccountCard from '../components/AccountCard'

const HomePage = () => {

  const {fetchArts, arts, fetchInfo, daoInfo, fetchArtist, artist} = useArt();
  console.log(arts.data);

  useEffect(() => {
    fetchArts();
    fetchInfo();
    fetchArtist();
  }, [fetchArts, fetchInfo, fetchArtist])



  // Check if arts array is populated before rendering AccountCard
  const isArtsLoaded = arts.length > 0;

  return (
    <Container maxW='container.xl' py={12}>
      <VStack>
        <Text fontSize="30" fontWeight="bold" textAlign="center">Art Gallery</Text>

        <HStack w={"full"} spacing={10}>

        <HStack spacing={"5px"} w={"90%"}>
          <SimpleGrid columns={3} spacing={10} w={"full"}>
            {arts.map((art) => (
              <ArtCard key={art._id} art={art}/>
            ))}
          </SimpleGrid>
        </HStack>
        <VStack w={"20%"} mb={"auto"}>     
          {isArtsLoaded && (
            <Box w={"full"} display={"flex"} flexDirection={"column"} alignItems={"flex-start"} mb={"auto"}>
              <MarketCard daoInfo={daoInfo} />
            </Box>
          )}
          {isArtsLoaded && (
            <Box w={"full"} display={"flex"} flexDirection={"column"} alignItems={"flex-start"} mb={"auto"}>
              <AccountCard artist={artist} />
            </Box>
          )}
        </VStack>

        </HStack>



      </VStack>
    </Container>
  )
}

export default HomePage