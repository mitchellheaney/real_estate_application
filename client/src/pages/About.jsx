import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';

export default function About() {

  return (
    <>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-semibold'>About Page</h1>
        <p>EstateFinder is an application developed by Mitchell Heaney (completed 14/01/2024) that allows users to better 
          browse, list and compare properties on the website. It is a React application using the MERN stack:    
        </p>
        <div className='px-5'>
          <ul className='text-slate-600'>
            <li className='font-semibold'>&#x2022; MongoDB.</li>
            <li className='font-semibold'>&#x2022; ExpressJS.</li>
            <li className='font-semibold'>&#x2022; React.</li>
            <li className='font-semibold'>&#x2022; NodeJS.</li>
          </ul>
        </div>
        <p>Other technologies that were used and learnt includes <span className='text-slate-600 italic'>Redux state management, Firebase, JWT & Tailwind CSS.</span>
          I am an eager software developer who has a knack of learning and developing new software systems in a user-friendly way. I hope this application
          offers you as much value as I believe it does!
        </p>
        <div className='border-b-4'>

        </div>
        <h1 className='text-3xl font-semibold'>Contact Me!</h1>
        <div>
          <a className='mr-3' href='https://www.linkedin.com/in/mitchellheaney/'>
            <button className='border transform transition hover:scale-95 opacity-90 bg-blue-500 text-white rounded-lg p-2'>LinkedIn</button>
          </a>
          <a href='https://github.com/mitchellheaney?tab=repositories'>
            <button className='border transform transition hover:scale-95 opacity-90 bg-slate-700 text-white rounded-lg p-2'>Github</button>
          </a>
        </div>
        <Link to={`mailto:mitchell.heaney4@gmail.com?subject=Contact_via_EstateFinder`} className='bg-slate-700 text-white text-center p-3 rounded-lg transform transition duration-300 hover:scale-105'>
						Send Email
				</Link>
      </div>
    </>
  )
}
