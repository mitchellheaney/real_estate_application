import React, { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {

	const { currentUser } = useSelector(state => state.user);
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set('searchTerm', searchTerm);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromURL = urlParams.get('searchTerm');
		if (searchTermFromURL) {
			setSearchTerm(searchTermFromURL);
		}
	}, [location.search]);

  return (
    <header className='bg-slate-200 shadow-md'>
		<div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
			<Link to='/'>
				<Typography variant='h5' className='font-bold text-sm sm:text-xl flex flex-wrap'>
					<span className='text-slate-500'>Estate</span>
					<span className='text-slate-700'>Finder</span>
				</Typography>
			</Link>
			<form onSubmit={handleSubmit} className='bg-slate-100 rounded-lg p-3 items-center flex'>
				<input value={searchTerm} type='text' placeholder='Search...' onChange={ (e) => setSearchTerm(e.target.value) } className='bg-transparent focus:outline-none w-24 sm:w-64'/>
				<button>
					<SearchIcon className='text-slate-500 w-full h-full transform transition hover:scale-125'/>
				</button>
			</form>
			<ul className='flex gap-5'>
				<li className='hidden sm:inline transform transition duration-300 hover:scale-125 hover:text-slate-500'><Link to='/'>Home</Link></li>
				<li className='hidden sm:inline transform transition duration-300 hover:scale-125 hover:text-slate-500 justify-center items-center'><Link to='/about'>About</Link></li>
				
				<Link to='/profile'>
					{ currentUser ? (
						<img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='Profile'/>
					) : (
						<li className='transform transition duration-300 hover:scale-125 hover:text-slate-500 justify-center items-center'>Sign In</li>
					)}
				</Link>
			</ul>
		</div>
    </header>
  )
}

