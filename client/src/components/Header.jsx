import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {

	const { currentUser } = useSelector(state => state.user);

  return (
    <header className='bg-slate-200 shadow-md'>
		<div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
			<Link to='/'>
				<Typography variant='h5' className='font-bold text-sm sm:text-xl flex flex-wrap'>
					<span className='text-slate-500'>Estate</span>
					<span className='text-slate-700'>Finder</span>
				</Typography>
			</Link>
			<form className='bg-slate-100 rounded-lg p-3 items-center flex'>
				<input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
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

