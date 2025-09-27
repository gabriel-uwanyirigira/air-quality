import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MachineLearning from "./pages/MachineLearning";
import Tracking from "./pages/Tracking";
import SensorDetails from "./pages/SensorDetails";
import Sensors from "./pages/Sensors";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ml" element={<MachineLearning />} />
        <Route path="/track" element={<Tracking />} />
        <Route path="/sensors" element={<Sensors />} />
        <Route path="/sensor/:sensorId" element={<SensorDetails />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App