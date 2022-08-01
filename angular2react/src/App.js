import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Contact from "./pages/Contact/Contact";
import Converter from "./pages/Converter/Converter";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import General from "./pages/About/General/General";
import Support from "./pages/About/Support/Support";
import HowToUse from "./pages/About/HowToUse/HowToUse";
import FAQ from "./pages/About/FAQ/FAQ";
import "./App.css";
import Upload from "./pages/Upload/Upload";
import { useSelector } from "react-redux";
import NotFound from "./pages/NotFound/NotFound";
import HTMLSupport from "./pages/About/Support/HTML/HTMLSupport";
import AngularSupport from "./pages/About/Support/Angular/AngularSupport";
import JavaScriptSupport from "./pages/About/Support/JavaScript/JavaScriptSupport";

function App() {
  const isRunning = useSelector((state) => state.conversion.isRunning);
  console.log(isRunning);

  return (
    <div className="container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="about" element={<About />}>
          <Route path="general" element={<General />}></Route>
          <Route path="support/*" element={<Support />}>
            <Route path="html" element={<HTMLSupport />}></Route>
            <Route path="angular" element={<AngularSupport />}></Route>
            <Route path="javascript" element={<JavaScriptSupport />}></Route>
          </Route>
          <Route path="FAQ" element={<FAQ />}></Route>
          <Route path="how-to-use" element={<HowToUse />}></Route>
        </Route>
        <Route path="upload" element={<Upload />}></Route>
        {isRunning && <Route path="converter" element={<Converter />}></Route>}
        <Route path="contact" element={<Contact />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
