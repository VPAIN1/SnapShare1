import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Verify from './pages/Verify';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Images from './pages/Images';
import Feed from './pages/Feed';
import MyPosts from './pages/MyPosts';
import About from './pages/About';
import Profile from './pages/Profile';
import UpdateProfile from './pages/UpdateProfile';
import ForgetPassword from './pages/ForgetPassword';
import ChangePassword from './pages/ChangePassword';

const router = createBrowserRouter([
  {
    path: '/home',
    element: <><Navbar /><Home /><Footer /></>
  },
  {
    path: '/register',
    element: <><Register /></>
  },
  {
    path: '/login',
    element: <><Login /></>
  },
  {
    path: '/',
    element: <><Login /></>
  },
  {
    path: '/verify',
    element: <><Verify /></>
  },
  {
    path: '/publicPosts',
    element: <><Navbar /><Images /><Footer /></>
  },
  {
    path: '/Feed',
    element: <><Navbar /><Feed /><Footer /></>
  }, {
    path: '/myposts',
    element: <><Navbar /><MyPosts /><Footer /></>
  },
  {
    path: '/about',
    element: <><Navbar /><About /><Footer /></>
  },
  {
    path: '/profile',
    element: <><Navbar /><Profile /><Footer /></>
  },
  {
    path: '/update-profile',
    element: <><Navbar /><UpdateProfile /><Footer /></>
  }, {
    path: '/change-password/:email',
    element: <><Navbar /><ChangePassword /><Footer /></>
  }, {
    path: '/forget-password',
    element: <><Navbar /><ForgetPassword /><Footer /></>
  }
]);

export const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App;