import React from 'react'
import { Box, Text } from '@chakra-ui/react'

const AccountCard = ({ artist }) => {
  return (
    <Box       
        borderRadius="lg"
        boxShadow="xl"
        maxWidth="400px"
        overflow="hidden"
        bg="white"
        mx="auto"
        p={5}
        mt={5}
        mb={5}
        border="3px solid #ddd"
        borderColor={"black"}
        bgGradient="linear(to-br,rgb(255, 255, 255),rgb(255, 255, 255))"
        w={"full"}
    >
        <Text color="black" align={"center"} fontWeight={"bold"} fontSize={20}>Account Details</Text>
        <Text color={"black"} align={"left"}>Artist Balance: {parseFloat(artist.ArtistBalance).toFixed(2)}</Text>
        {/* <Text color={"black"} align={"left"}>Wallet Address: {artist.ArtistWalletAddress}</Text> */}
    </Box>
  )
}

export default AccountCard