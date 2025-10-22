import React from 'react'
import {Routes,Route} from "react-router-dom"
import HomePage from './pages/HomePage'
import ChatRoomPage from './pages/ChatRoomPage.js'
import CommunityPage from './pages/Community.js'
import RoomPage from './pages/RoomPage.js'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/chatroom' element={<ChatRoomPage />} />
        <Route path='/community' element={<CommunityPage />} />
         <Route path='/rooms' element={<RoomPage/>}/>
     </Routes>
    </>
  )
}

export default App