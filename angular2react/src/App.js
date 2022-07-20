import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact/Contact";
import Converter from "./pages/Converter/Converter";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import General from "./pages/About/General/General";
import Compatibility from "./pages/About/Compatibility/Compatibility";
import HowToUse from "./pages/About/HowToUse/HowToUse";
import FAQ from "./pages/About/FAQ/FAQ";
import "./App.css";
import Upload from "./pages/Upload/Upload";

function App() {
  return (
    <div className="container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="about" element={<About />}>
          <Route path="general" element={<General />}></Route>
          <Route path="compatibility" element={<Compatibility />}></Route>
          <Route path="FAQ" element={<FAQ />}></Route>
          <Route path="how-to-use" element={<HowToUse />}></Route>
        </Route>
        <Route path="upload" element={<Upload />}></Route>
        <Route path="converter" element={<Converter />}></Route>
        <Route path="contact" element={<Contact />}></Route>
      </Routes>
    </div>
  );
}

export default App;
