import { Box, Flex, Text, Spacer, Button, Image } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <Box bg="white" p={8}>
        <Flex align="center" maxW="1200px" mx="auto">
            {/* Logo */}

            <Image
                src="https://i.postimg.cc/4yCXDS4p/Screenshot-2025-04-13-at-3-21-22-PM.png"  // Replace with the actual path to your logo image
                alt="MerakiNexus Logo"
                boxSize="70px"  // Adjust size of the logo
                objectFit="contain"
                borderRadius={"10"}
            />

            <Link to={"/"}>
                <Text fontSize="2xl" fontWeight="bold" color="black">
                MerakiNexus
                </Text>
            </Link>

            <Spacer />

            {/* Navigation Links */}
            <Flex display={{ base: 'none', md: 'flex' }} ml={4}>
            <Link to="/upload">
                <Button variant="link" color="black" _hover={{ textDecoration: 'underline' }}>
                Upload Art
                </Button>
            </Link>
            <Link to="/account">
                <Button variant="link" color="black" ml={4} _hover={{ textDecoration: 'underline' }}>
                Account
                </Button>
            </Link>
            <Link to="/about-us">
                <Button variant="link" color="black" ml={4} _hover={{ textDecoration: 'underline' }}>
                About Us
                </Button>
            </Link>
            </Flex>

            {/* Logout Button */}
            <Button colorScheme="black" color="black" ml={4}>
            Logout
            </Button>
        </Flex>
    </Box>
  )
}

export default Navbar