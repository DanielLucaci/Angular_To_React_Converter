import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import { useSelector } from "react-redux";
import { Suspense } from "react";
import LoadingSpinner from "./components/Layout/LoadingSpinner/LoadingSpinner";
import HTMLSupport from "./pages/About/Support/HTML/HTMLSupport";
import AngularSupport from "./pages/About/Support/Angular/AngularSupport";
import JavaScriptSupport from "./pages/About/Support/JavaScript/JavaScriptSupport";

const Contact = React.lazy(() => import("./pages/Contact/Contact"));
const Converter = React.lazy(() => import("./pages/Converter/Converter"));
const Home = React.lazy(() => import("./pages/Home/Home"));
const About = React.lazy(() => import("./pages/About/About"));
const General = React.lazy(() => import("./pages/About/General/General"));
const Support = React.lazy(() => import("./pages/About/Support/Support"));
const HowToUse = React.lazy(() => import("./pages/About/HowToUse/HowToUse"));
const NotFound = React.lazy(() => import("./pages/NotFound/NotFound"));
const FAQ = React.lazy(() => import("./pages/About/FAQ/FAQ"));
const Upload = React.lazy(() => import("./pages/Upload/Upload"));

function App() {
  const isRunning = useSelector((state) => state.conversion.isRunning);
  console.log(isRunning);

  return (
    <div className="container">
      <Navbar />
      <Suspense
        fallback={
          <div className="centered">
            <LoadingSpinner />
          </div>
        }
      >
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
          {isRunning && (
            <Route path="converter" element={<Converter />}></Route>
          )}
          <Route path="contact" element={<Contact />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
