import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'

function Contact({listing}) {

	const [landlord, setLandlord] = useState(null);
	const [message, setMessage] = useState("");
	const onChange = (e) => {
		setMessage(e.target.value);
	};

	useEffect(() => {
		const fetchLandlord = async () => {
			try {
				const res = await fetch(`/server/user/${listing.userRef}`)
				const data = await res.json();
				setLandlord(data);
			} catch (err) {
				console.log(err);
			}
		}

		fetchLandlord();
		
	}, [listing.userRef])

  return (
    <div>
			{landlord && (
				<div className='flex flex-col gap-2'>
					<p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name}</span></p>
					<textarea name="message" id="message" rows="2" value={message} onChange={onChange} placeholder='Enter message' className='w-full border p-3 rounded-lg'></textarea>
					
					<Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body${message}`} className='bg-slate-700 text-white text-center p-3 rounded-lg transform transition duration-300 hover:scale-105'>
						Send Message
					</Link>
				</div>
			)}
		</div>
  )
}

export default Contact;