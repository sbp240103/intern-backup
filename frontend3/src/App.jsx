import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserSignup from './pages/UserSignup'
import Contact from './pages/contact'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<UserSignup />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
    </div>
  )
}

export default App