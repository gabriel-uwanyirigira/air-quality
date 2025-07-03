import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MachineLearning from "./pages/MachineLearning";
import Tracking from "./pages/Tracking";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ml" element={<MachineLearning />} />
        <Route path="/track" element={<Tracking />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
