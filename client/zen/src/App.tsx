import React from 'react'
import {Routes, Route} from 'react-router-dom'
import About from './pages/About'
import Header from './components/Header'
import Register from './pages/Register'

const App: React.FC = () => {
  return (
    <>
    <Header/>
    <Routes>
      <Route path='/about' element={<About/>} />
      <Route path='/signup' element={<Register/>} />
    </Routes>
    </>
  )
}

export default App