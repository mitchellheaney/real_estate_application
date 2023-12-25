import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
              />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
              />
              <span>Offer</span>
            </div>
          </div>
					<div className='flex flex-wrap gap-6'>
						<div className='flex items-center gap-2'>
							<input className='p-3 w-16 border border-gray-300 rounded-lg' type="number" id='bedrooms' required />
							<p>Bedrooms</p>
						</div>
						<div className='flex items-center gap-2'>
							<input className='p-3 w-16 border border-gray-300 rounded-lg' type="number" id='bathrooms' required />
							<p>Bathrooms</p>
						</div>
						<div className='flex items-center gap-2'>
							<input className='p-3 w-36 border border-gray-300 rounded-lg' type="number" id='regularPrice' required />
							<div className='flex flex-col'>
								<p>Regular Price</p>
								<p className='text-sm'>($ / month)</p>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<input className='p-3 w-36 border border-gray-300 rounded-lg' type="number" id='discountedPrice' required />
							<div className='flex flex-col'>
								<p>Discounted Price</p>
								<p className='text-sm'>($ / month)</p>
							</div>
						</div>
					</div>
        </div>
				<div className='flex flex-col flex-1 gap-4'>
					<p className='font-semibold '>Images:
						<span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 10)</span>
					</p>
					<div className='flex gap-4'>
						<input className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
						<button className='disabled:opacity-80 p-3 font-semibold text-green-700 border border-green-700 rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg'>UPLOAD</button>
					</div>
					<button className='disabled:opacity-80 border p-3 bg-slate-700 text-white font-semibold rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-slate-500'>
						CREATE LISTING
					</button>
				</div>
      </form>
    </main>
  )
}
