import { Box, Text } from "@chakra-ui/react"
import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CreatePage from "./pages/CreatePage"
import UploadPage from "./pages/UploadPage"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HostHomePage from "./pages/HostHomePage"

function App() {

  return (
    <Box minH={"100vh"} bgGradient='linear(to-l, #7928CA, #FF0080)' display={"flex"} flexDirection={"column"}>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/create" element={<CreatePage/>}/>
        <Route path="/upload" element={<UploadPage/>}/>
        <Route path="/hostGallery" element={<HostHomePage/>}/>
      </Routes>
      
      <Box mt={"auto"}>
        <Footer/>
      </Box>
    </Box>

  )
}

export default App
