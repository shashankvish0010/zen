import React from 'react'
import {Routes, Route} from 'react-router-dom'
import About from './pages/About'
import Header from './components/Header'
import Register from './pages/Register'
import Login from './pages/Login'
import OtpVerification from './pages/OtpVerification'
import Home from './pages/Home'

const App: React.FC = () => {
  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/about' element={<About/>} />
      <Route path='/signup' element={<Register/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/otp/verification/:id' element={<OtpVerification/>} />
    </Routes>
    </>
  )
}

export default App