import React from 'react'
import {Routes, Route} from 'react-router-dom'
import About from './pages/About'
import Header from './components/Header'
import Register from './pages/Register'
import Login from './pages/Login'
import OtpVerification from './pages/OtpVerification'
import Home from './pages/Home'
import VideoCall from './pages/VideoCall'
import List from './pages/List'
import Calling from './pages/Calling'
import CreatorLiveStream from './pages/CreatorLiveStream'
import LiveStream from './pages/LiveStream'

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
      <Route path='/videocall' element={<VideoCall/>} />
      <Route path='/zenlist/:id' element={<List/>} />
      <Route path='/calling/:zenno' element={<Calling/>} />
      <Route path='/livestream' element={<CreatorLiveStream/>} />
      <Route path='/live' element={<LiveStream/>} />
    </Routes>
    </>
  )
}

export default App