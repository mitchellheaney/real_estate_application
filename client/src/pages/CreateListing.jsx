import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';

export default function CreateListing() {

	const [files, setFiles] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [imageUploadError, setImageUploadError] = useState(false);
	const [formData, setFormData] = useState({
		imageURLs: [],
		name: "",
		description: "",
		address: "",
		type: "",
		bedrooms: 0,
		bathrooms: 0,
		regularPrice: 0,
		discountedPrice: 0,
		offer: false,
		parking: false,
		furnished: false,
	});
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const {currentUser} = useSelector((state) => state.user);

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

	const handleChange = (e) => {
		if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (formData.imageURLs.length < 1) return setError("You must upload at least 1 image.")
			if (+formData.regularPrice < +formData.discountedPrice) return setError("Discounted price must be less than regular.")

			setLoading(true);
			setError(false);

			const res = await fetch('/server/listing/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					userRef: currentUser._id,
				}),
			});

			const data = await res.json();
			setLoading(false);
			if (data.success === false) {
				setError(data.message);
			}
			navigate(`/listing/${data._id}`);

		} catch(err) {
			setError(err.message);
			setLoading(false);
		}
	};

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
						onChange={handleChange}
						value={formData.name}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
						onChange={handleChange}
						value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
						onChange={handleChange}
						value={formData.address}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
								onChange={handleChange}
								checked={formData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
								onChange={handleChange}
								checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
								onChange={handleChange}
								checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
								onChange={handleChange}
								checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
								onChange={handleChange}
								checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
					<div className='flex flex-wrap gap-6'>
						<div className='flex items-center gap-2'>
							<input className='p-3 w-16 border border-gray-300 rounded-lg' type="number" id='bedrooms' required onChange={handleChange} value={formData.bedrooms} />
							<p>Bedrooms</p>
						</div>
						<div className='flex items-center gap-2'>
							<input className='p-3 w-16 border border-gray-300 rounded-lg' type="number" id='bathrooms' required onChange={handleChange} value={formData.bathrooms} />
							<p>Bathrooms</p>
						</div>
						<div className='flex items-center gap-2'>
							<input className='p-3 w-36 border border-gray-300 rounded-lg' type="number" id='regularPrice' required onChange={handleChange} value={formData.regularPrice} />
							<div className='flex flex-col'>
								<p>Regular Price</p>
								<p className='text-sm'>($ / week)</p>
							</div>
						</div>
						{
							formData.offer && 
						
							<div className='flex items-center gap-2'>
								<input className='p-3 w-36 border border-gray-300 rounded-lg' type="number" id='discountedPrice' required onChange={handleChange} value={formData.discountedPrice} />
								<div className='flex flex-col'>
									<p>Discounted Price</p>
									<p className='text-sm'>($ / week)</p>
								</div>
							</div>
						}
					</div>
        </div>
				<div className='flex flex-col flex-1 gap-4'>
					<p className='font-semibold '>Images:
						<span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 10)</span>
					</p>
					<div className='flex gap-4'>
						<input onChange={ (e) => {setFiles(e.target.files)} } className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
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
					<button disabled={loading || uploading} className='disabled:opacity-80 border p-3 bg-slate-700 text-white font-semibold rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-slate-500'>
						{loading ? 'Creating Listing...' : 'Create Listing'}
					</button>
					{error && <p className='text-red-500'>{error}</p> }
				</div>
      </form>
    </main>
  )
}
