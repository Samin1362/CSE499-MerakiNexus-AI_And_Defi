import { Container, VStack, Heading, Box, Input, useColorModeValue, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react'
import { useProductStore } from '../store/product';

const CreatePage = () => {

  const [newProduct, setNewProduct] = useState ({
    name: "", 
    price: "", 
    image: "", 
  });

  const toast = useToast();
  
  const { createProduct } = useProductStore();
  const handleAddProduct = async() => {
    const response = await createProduct(newProduct);
    if (!response.success){
      toast({
        title: "Error", 
        description: response.message, 
        status: "error", 
        isClosable: true
      })
    }else{
      toast({
        title: "Success", 
        description: response.message, 
        status: "success", 
        isClosable: true
      })
    }
    setNewProduct({name:"", price:"", image:""});
  }

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2x1"} textAlign={"center"} mb={8}>
          Create new Product
        </Heading>
        <Box w={"full"} bg={useColorModeValue("white", "gray.800")} p={6} rounded={"lg"} shadow={"md"}>
          <VStack spacing={4}>
            <Input placeholder="Product Name" name="name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}/>
            <Input placeholder="Price" name="price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}/>
            <Input placeholder="Image URL" name="image" value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}/>
            <Button colorScheme='blue' onClick={handleAddProduct} w='full'>Add Product</Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

export default CreatePage