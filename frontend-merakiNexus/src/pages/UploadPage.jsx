import React, { useState } from 'react';
import { Container, VStack, Heading, Box, Input, Button, useToast } from '@chakra-ui/react';
import { useArt } from '../store/arts';

const UploadPage = () => {
  const [newArt, setNewArt] = useState({
    name: "",
    descriptionByArtist: "",
    imageUrl: "",
    image: null, // Store the file as a reference, not a string
  });

  const toast = useToast();
  const { createArt } = useArt();

  const handleAddArt = async () => {
    const response = await createArt(newArt);
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
      });
      setNewArt({ name: "", descriptionByArtist: "", imageUrl: "", image: null }); // Reset after submit
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setNewArt({
      ...newArt,
      image: e.target.files[0], // Get the selected file (first file)
    });
  };


  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8} my={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Upload ArtWork
        </Heading>
        <Box w={"full"} bg={"gray.200"} p={6} rounded={"lg"} shadow={"md"}>
          <VStack spacing={4}>
            <Input
              placeholder="Art Name"
              value={newArt.name}
              onChange={(e) => setNewArt({ ...newArt, name: e.target.value })}
              _placeholder={{ color: "black" }}
              borderColor={"black"}
              name="name"
              size={"lg"}
              color={"black"}
            />
            <Input
              placeholder="Art Description"
              value={newArt.descriptionByArtist}
              onChange={(e) => setNewArt({ ...newArt, descriptionByArtist: e.target.value })}
              _placeholder={{ color: "black" }}
              borderColor={"black"}
              name="description"
              size={"lg"}
              color={"black"}
            />
            <Input
              placeholder="Image URL"
              value={newArt.imageUrl}
              onChange={(e) => setNewArt({ ...newArt, imageUrl: e.target.value })}
              _placeholder={{ color: "black" }}
              borderColor={"black"}
              name="description"
              size={"lg"}
              color={"black"}
            />
            <Input
              type="file"
              accept="image/*"
              size={"lg"}
              py={2}
              color={"black"}
              onChange={handleFileChange} // Handle the file change
            />
            <Button
              onClick={handleAddArt}
              size="md"
              height="48px"
              width="580px"
              border="2px"
              borderColor="black.500"
              colorScheme="black"
              color={"Black"}
              fontSize={20}
              fontWeight={"bold"}
            >
              Submit
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default UploadPage;
