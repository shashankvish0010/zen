import React from 'react'
import {Routes, Route} from 'react-router-dom'
import About from './pages/About'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path='/about' element={<About/>} />
    </Routes>
  )
}

export default App