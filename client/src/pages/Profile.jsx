import React from 'react'
import { useSelector } from 'react-redux';

export default function Profile() {

  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-9'>Profile</h1>
      <form className='flex flex-col gap-2'> 
        <img className='rounded-full h-28 w-28 object-cover cursor-pointer self-center my-3' src={currentUser.avatar} alt='Profile'/>
        <input type='text' id='username' placeholder='Username' className='border p-3 rounded-lg' />
        <input type='text' id='email' placeholder='Email' className='border p-3 rounded-lg' />
        <input type='text' id='password' placeholder='Password' className='border p-3 rounded-lg' />
        <button className='bg-slate-600 p-3 mt-2 rounded-lg text-white font-semibold transform transition duration-300 hover:scale-105 hover:bg-slate-500'>UPDATE</button>
      </form>
      <div className='flex mt-3 justify-between'>
        <button className='bg-red-500 text-m p-2 mt-2 rounded-lg text-white transform transition duration-300 hover:scale-105 hover:bg-red-400'>Delete Account</button>
        <button className='bg-red-500 text-m p-2 mt-2 rounded-lg text-white transform transition duration-300 hover:scale-105 hover:bg-red-400'>Sign Out</button>
      </div>
    </div>
  )
}
