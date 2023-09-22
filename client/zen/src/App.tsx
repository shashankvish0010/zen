import React from 'react'
import {Routes, Route} from 'react-router-dom'
import About from './pages/About'
import Header from './components/Header'

const App: React.FC = () => {
  return (
    <>
    <Header/>
    <Routes>
      <Route path='/about' element={<About/>} />
    </Routes>
    </>
  )
}

export default App