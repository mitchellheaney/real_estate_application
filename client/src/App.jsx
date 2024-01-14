import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import About from './pages/About';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Listing from './pages/Listing';
import Search from './pages/Search';

export default function () {
  return (
    <BrowserRouter>
			<Header />
			<Routes>
				<Route path='/search' element={<Search />} />
				<Route path='/' element={<Home />} />
				<Route path='/sign-in' element={<SignIn />} />
				<Route path='/sign-up' element={<SignUp />} />
				<Route path='/about' element={<About />} />
				<Route path='/listing/:listingId' element={<Listing />} />


				<Route element={<PrivateRoute />}>
					<Route path='/profile' element={<Profile />} />
					<Route path='/create-listing' element={<CreateListing/>} />
					<Route path='/edit-listing/:listingId' element={<EditListing/>} />
				</Route>
			</Routes>
		</BrowserRouter>
  )
}
