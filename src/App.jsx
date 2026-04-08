
import './App.css'
import Home from './Components/Home';
import Feedback from './Components/Feedback';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <nav className="rm-nav">
        <Link to="/">
          <div className="rm-logo" style={{ cursor:"pointer"}}>Resu<span>Mind</span></div></Link>
          <ul className="rm-nav-links">
         
          </ul>
          {open ? ( <Link to="/feedback"><button className="rm-nav-cta" onClick={() => setOpen(false)}>See an exemple →</button></Link>):( <Link to="/"><button className="rm-nav-cta" onClick={() => setOpen(true)}>Go back home</button></Link>)}
         
          
        </nav>
   
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
     
    </div>
  );


}

export default App
