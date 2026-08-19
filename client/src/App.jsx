import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Otp from './pages/Otp'
import Profile from './pages/Profile'
import Profile_info from './pages/Profile-info'
import Profile_transform from './pages/Profile-transform'
import Profile_following from './pages/Profile-following'
import Profile_save_posts from './pages/Profile-save-posts'
import Search from './pages/Search'
import Search_result from './pages/Search-result'
import Creator_user_view from './pages/Creator-user-view'
import Post_user_view from './pages/Post-user-view'
import Upload from './pages/Upload'
import Creator from './pages/Creator'
import Edit_creator from './pages/Edit-creator'
import Edit_post from './pages/Edit-post'
import Post from './pages/Post'
import Notification from './pages/Notification'
import Creator_bio_user_view from './pages/Creator-bio-user-view'
import ScrollToTop from './context/ScrollToTop'
import PageNotFound from './pages/PageNotFound'
import ProtectedRoute from './context/ProtectedRoute'

const App = () => {
  return (
    <div>
        <ScrollToTop />
        <Routes>
          {/* Protected Routes */}
          <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>} />
          <Route path='/personal-info' element={<ProtectedRoute><Profile_info/></ProtectedRoute>} />
          <Route path='/profile-transform' element={<ProtectedRoute><Profile_transform/></ProtectedRoute>} />
          <Route path='/following' element={<ProtectedRoute><Profile_following/></ProtectedRoute>} />
          <Route path='/saved-posts' element={<ProtectedRoute><Profile_save_posts/></ProtectedRoute>} />
          <Route path='/notification' element={<ProtectedRoute><Notification /></ProtectedRoute>} />
          <Route path='/upload' element={<ProtectedRoute><Upload/></ProtectedRoute>} />
          <Route path='/creator' element={<ProtectedRoute><Creator/></ProtectedRoute>} />
          <Route path='/edit-creator/:id' element={<ProtectedRoute><Edit_creator/></ProtectedRoute>} />
          <Route path='/edit-post/:id' element={<ProtectedRoute><Edit_post/></ProtectedRoute>} />
          <Route path='/post-view/:id' element={<ProtectedRoute><Post/></ProtectedRoute>} />

          {/* Public Routes */}
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/otp' element={<Otp/>} />
          <Route path='/search' element={<Search/>} />
          <Route path='/search/:id' element={<Search_result/>} />
          <Route path='/creator/:id' element={<Creator_user_view/>} />
          <Route path='/creator/:id/bio' element={<Creator_bio_user_view/>} />
          <Route path='/post/:id' element={<Post_user_view/>} />

          {/* Fallback Route */}
          <Route path='*' element={<PageNotFound />} />
        </Routes>
    </div>
  )
}

export default App
