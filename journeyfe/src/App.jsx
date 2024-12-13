import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import './App.css';
import Home from "./Pages/Home";


function App() {
  return (
    <div className="App">
      <Router>
        <div className="App">
          <Routes>
          
            <Route path="/" element={<Home />} />
            

          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
