import React from 'react'
import { Box, Container, Grid, Text, Link, IconButton, useBreakpointValue, Image } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';



const Footer = () => {

    const socialIcons = [
        { icon: <FaFacebook />, link: 'https://facebook.com' },
        { icon: <FaTwitter />, link: 'https://twitter.com' },
        { icon: <FaInstagram />, link: 'https://instagram.com' },
      ];

  return (
    <Box bg="black" color="white" py={10}>
      <Container maxW="container.xl">
        {/* Top Row with Logo */}
        <Grid templateColumns="repeat(2, 1fr)" alignItems="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold" display="flex" alignItems="center">
            <Image
                src="https://i.postimg.cc/Y0g9C5BP/Screenshot-2025-04-13-at-5-06-41-PM.png"  // Replace with the actual path to your logo image
                alt="MerakiNexus Logo"
                boxSize="70px"  // Adjust size of the logo
                objectFit="contain"
                borderRadius={"10"}
            />
            <span>MerakiNexus Logo</span>
          </Text>
          <Text fontSize="sm" textAlign="right" color="gray.400">
            &copy; 2023–2025 MerakiNexus Inc.
          </Text>
        </Grid>

        {/* Links Section */}
        <Grid templateColumns="repeat(6, 1fr)" gap={6} mb={6} display={{ base: 'none', md: 'grid' }}>
          <Link href="#">Link 1</Link>
          <Link href="#">Link 2</Link>
          <Link href="#">Link 3</Link>
          <Link href="#">Link 4</Link>
          <Link href="#">Link 5</Link>
          <Link href="#">Link 6</Link>
        </Grid>

        {/* Social Media Icons */}
        <Grid templateColumns="repeat(3, 1fr)" gap={6} justifyContent="center">
          {socialIcons.map((social, index) => (
            <IconButton
              key={index}
              as="a"
              href={social.link}
              aria-label={social.link}
              icon={social.icon}
              size="lg"
              bg="transparent"
              _hover={{ bg: 'gray.700' }}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Footer