import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';

import 'swiper/css/bundle';
import { list } from 'firebase/storage';
import { listItemIconClasses } from '@mui/material';

export default function Listing() {

	SwiperCore.use( [Navigation] );

	const params = useParams();
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [copied, setCopied] = useState(false);

	useEffect( () => {
		const fetchListing = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/server/listing/get/${params.listingId}`);
				const data = await res.json();
				if (data.success === false) {
					setError(true);
					setLoading(false);
					return;
				}

				setListing(data);
				setLoading(false);
			} catch (err) {
				setError(true);
				setLoading(false);
			}
		};

		fetchListing();
	}, [params.listingId]);

  return (
    <>
			{
				loading && <p className='text-center my-7 text-2xl'>Loading...</p>
			}
			{
				error && <p className='text-center my-7 text-2xl text-red-500'>Something went wrong, try again.</p>
			}
			{
				listing && !loading && !error && 
				(
					<>
						<Swiper navigation>
							{
								listing.imageURLs.map( (url) => (
									<SwiperSlide key={url}>
										<div className='h-[550px]' style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}>

										</div>
									</SwiperSlide>
								 ) )
							}
						</Swiper>
						<div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
							<FaShare
								className='text-slate-500'
								onClick={ () => {
									navigator.clipboard.writeText(window.location.href);
									setCopied(true);
									setTimeout( () => {
										setCopied(false);
									}, 2000 );
								}}
							/>
						</div>
						{
							copied && 
							(
								<p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>Link copied!</p>
							)
						}
						<div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
							<p className='text-2xl font-semibold'>
								{listing.name}
							</p>
							{
								listing.offer ?
									(
										<>
											<p className='text-3xl'>
												<del className='text-red-700'>
													${listing.regularPrice}
												</del>
												<span> </span>
												<span className='text-green-600'>
													${listing.discountedPrice} 
												</span>
												{listing.type === 'rent' && <span className='text-green-600'> / month</span>}
											</p>
										</>
									)
									:
									(
										<p className='text-3xl justify-center'>
											${listing.regularPrice}
											{listing.type === 'rent' && <span> / month</span>}
										</p>
									)
								}
							<p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
								<FaMapMarkerAlt className='text-green-700' />
								{listing.address}
							</p>
							<div className='flex gap-4'>
								<p className='font-semibold bg-red-900 w-full max-w-[200px] text-white text-center p-2 rounded-md'>
									{listing.type === "rent" ? "For Rent" : "For Sale"}
								</p>
								{listing.offer && (
									<p className='bg-green-600 w-full max-w-[200px] text-white text-center p-2 rounded-md font-semibold'>
										${+listing.regularPrice - +listing.discountedPrice} OFF 
									</p>
              	)}				
							</div>
							<div>
								<h1 className='text-3xl mt-5 mb-2 font-semibold'>Description</h1>
								<p>{listing.description}</p>
							</div>
							<ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-6 sm:gap-6 p-3 rounded-lg border-2'>
								<li className='flex items-center gap-1 whitespace-nowrap '>
									<FaBed className='text-lg' />
									{listing.bedrooms > 1
										? `${listing.bedrooms} bedrooms`
										: `${listing.bedrooms} bedroom`
									}
								</li>
								<li className='flex items-center gap-1 whitespace-nowrap '>
									<FaBath className='text-lg' />
									{listing.bathrooms > 1
										? `${listing.bathrooms} baths `
										: `${listing.bathrooms} bath `}
								</li>
								<li className='flex items-center gap-1 whitespace-nowrap '>
									<FaParking className='text-lg' />
									{listing.parking ? 'Parking spot' : 'No Parking'}
								</li>
								<li className='flex items-center gap-1 whitespace-nowrap '>
									<FaChair className='text-lg' />
									{listing.furnished ? 'Furnished' : 'Unfurnished'}
								</li>
							</ul>
						</div>
					</>
				)
			}
    </>
  )
};