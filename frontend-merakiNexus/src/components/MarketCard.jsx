import { Box, Text } from '@chakra-ui/react'
import React from 'react'

const MarketCard = ({ daoInfo }) => {

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
        <Text color="black" align={"center"} fontWeight={"bold"}>Market Details</Text>
        <Text color={"black"} align={"left"}>Total Score: {parseFloat(daoInfo.totalArtScore).toFixed(2)}</Text>
        <Text color={"black"} align={"left"}>Available token: {parseFloat(daoInfo.daoToken).toFixed(2)}</Text>
    </Box>
  )
}

export default MarketCard