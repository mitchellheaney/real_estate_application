import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';

export default function CreateListing() {

	const [files, setFiles] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [imageUploadError, setImageUploadError] = useState(false);
	const [formData, setFormData] = useState({
		imageURLs: [],
	});

	const handleRemoveImage = (idx) => {
		setFormData({
			...formData,
			imageURLs: formData.imageURLs.filter( (_, i) => i !== idx ),
		});
	};

	const handleImageSubmit = (e) => {
		if (files.length > 0 && files.length + formData.imageURLs.length < 11) {
			setUploading(true);
			setImageUploadError(false);
			const promises = [];

			for (let i = 0; i < files.length; i++) {
				promises.push(storeImage(files[i]));
			}
			Promise.all(promises).then( (urls) => {
				setFormData({ ...formData, imageURLs: formData.imageURLs.concat(urls) });
				setImageUploadError(false);
				setUploading(false);
			}).catch( (err) => {
				setImageUploadError('Image upload failed (2 mb max/image)');
				setUploading(false);
			});
		} else {
			setImageUploadError('Have to upload 1-10 images.');
			setUploading(false);
		}
	};

	const storeImage = async (file) => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log(`Upload is ${progress}% done.`);
				},
				(err) => {
					reject(err);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) => {
						resolve(getDownloadURL);
					});
				}
			)
		});
	};

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
						<input onChange={ (e) => {setFiles(e.target.files)} } className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple size={formData.length} />
						<button disabled={uploading} type='button' onClick={handleImageSubmit} className='disabled:opacity-80 p-3 font-semibold text-green-700 border border-green-700 rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg'>{uploading ? 'Uploading...' : 'UPLOAD'}</button>
					</div>
					<p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
					{formData.imageURLs.length > 0 &&
            formData.imageURLs.map((url, index) => (
              <div
                key={url}
                className='flex justify-between rounded-lg p-3 border items-center bg-slate-50'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='bg-red-50 font-semibold p-3 text-red-700 rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg'
                >
                  DELETE
                </button>
              </div>
            ))
					}
					<button className='disabled:opacity-80 border p-3 bg-slate-700 text-white font-semibold rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-slate-500'>
						CREATE LISTING
					</button>
				</div>
      </form>
    </main>
  )
}
