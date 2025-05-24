import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MachineLearning from "./pages/MachineLearning";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ml" element={<MachineLearning />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
