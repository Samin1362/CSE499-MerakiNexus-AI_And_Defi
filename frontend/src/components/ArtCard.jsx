import React from 'react';
import { Box, Image, Text, Button, VStack, HStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast } from '@chakra-ui/react';
import { useArt } from '../store/arts';
import Web3 from 'web3';

const ArtCard = ({ art }) => {
  // If art.image is a base64 string, we need to render it as an image
  // const imageSrc = art.image
  //   ? art.image.startsWith("data:image/")  
  //     ? art.image  
  //     : `data:image/jpeg;base64,${art.image}` 
  //   : "https://i.postimg.cc/nLVmpRkD/temp-Imagevd4xpd.avif"; 

  let imageSrc;

  // Check if art.image is base64 or a URL
  if (art.image) {
    if (art.image.startsWith("https://")) {
      // If it's base64, use it directly
      imageSrc = art.image;
    } else {
      // If it's a URL, use it directly
      imageSrc = `data:image/jpeg;base64,${art.image}`;
    }
  } else {
    // Fallback to a placeholder image if no image is available
    imageSrc = "https://i.postimg.cc/nLVmpRkD/temp-Imagevd4xpd.avif";
  }


  
  const toast = useToast();
  const { deleteArt, transferArt } = useArt();
  const handleDeleteArt = async (pid) => {
    const response = await deleteArt(pid);
    
    if (!response.success) {
      toast({
        title: "Error",
        description: response.message,
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: response.message,
        status: "success",
        isClosable: true,
      })};

  }

  const web3 = new Web3(window.ethereum); //Initize web3
  const handleTransferArt = async (artId) => {

    try {
      // Request MetaMask accounts (wallet access)
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const accounts = await web3.eth.getAccounts();
      const sender = accounts[0]; // Get the sender's wallet address (MetaMask account)

      const receiver = "0xC68D9470B03ab145CAA86009F0c4909386FAc709"; // Static receiver wallet address for now

      // Prepare the transaction
      const transaction = {
        from: sender,
        to: receiver,
        value: web3.utils.toWei('0.0001', 'ether'), // Example: Sending 0.01 ETH
        gas: 2000000, // Gas limit (you can adjust as necessary)
      };

      // Send the transaction using MetaMask's provider
      const receipt = await web3.eth.sendTransaction(transaction);

      console.log('Transaction successful:', receipt);

      // After successful transaction, update art ownership in the database
      const response = await transferArt(artId); // Update the art ownership using your store logic
      if (!response.success) {
        toast({
          title: 'Error',
          description: response.message,
          status: 'error',
          isClosable: true,
        });
        return;
      }

      toast({
        title: 'Success',
        description: response.message,
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      toast({
        title: 'Error',
        description: 'Transaction failed. Please try again.',
        status: 'error',
        isClosable: true,
      });
    }

  }

  const { isOpen, onOpen, onClose } = useDisclosure()

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
      border="1px solid #ddd"
      bgGradient="linear(to-br, #9b59b6, #8e44ad)"
    >
      {/* Artwork Image */}
      <Image
        src={imageSrc} 
        alt="Art"
        borderRadius="md"
        boxSize="250px"
        objectFit="cover"
        mx="auto"
        mb={4}
      />
      {/* Artwork Details */}
      <VStack align="flex-start" spacing={3}>
        <Text fontSize="xl" fontWeight="bold" color="white">
          Aesthetic Score: {parseFloat(art.aesthetic_score).toFixed(2) || "N/A"}%
        </Text>
        <Text fontSize="xl" fontWeight="bold" color="white">
          Sentiment Score: {art.sentiment_score || "N/A"}%
        </Text>
        <Text fontSize="xl" fontWeight="bold" color="white">
          Memorability Score: {art.memorability_score || "N/A"}%
        </Text>
      </VStack>
      
      <Text mt={4} fontSize="lg" color="white">
        Details:
      </Text>
      
      <Text color="white" fontSize="md">
        Art name: {art.name} and Art description: {art.descriptionByArtist}
      </Text>
      
      {/* Buttons */}
      <HStack spacing={4} mt={4} justify="center">
        <Button colorScheme="teal" size="sm" onClick={onOpen}>Transfer</Button>
        <Button colorScheme="red" size="sm" onClick={() => handleDeleteArt(art._id)} >Delete</Button>
      </HStack>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="white">
          <ModalHeader color="black">Do you want to Sell? </ModalHeader>
          <ModalCloseButton color="black" />
          <ModalBody pb={6}>
            <Text fontSize="lg" fontWeight="bold" color="black">
              Art Name: "{art.name}" 
            </Text>
            <Text color="black" fontSize="md" mt={4}>
              Description: {art.descriptionByArtist}
            </Text>

            <Text color="black" fontSize="md" mt={4}>
              Selling Price: {parseFloat(art.sellingPrice).toFixed(2)}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => handleTransferArt(art._id)}>
              Start Transaction
            </Button>
            <Button colorScheme="red" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default ArtCard;
