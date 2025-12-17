import React from "react";
import { Routes, Route } from "react-router-dom";
import MobileNumber from "./MobileNmber/MobileNumber";
import HomePage from "./Home/HomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mobile" element={<MobileNumber />} />
    </Routes>
  );
}