import { useState } from 'react'
import './App.css'
import Main from './pages/Main';
import Upload from './pages/Upload';
import { Routes, Route, Outlet, Link } from "react-router-dom";
function App() {


  return (
    <Routes>
      <Route path="/" element={<Main></Main>}></Route>
      <Route path="upload" element={<Upload />} />
    </Routes>

  );
}

export default App
