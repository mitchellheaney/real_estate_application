import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {

  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-9'>Profile</h1>
      <form className='flex flex-col gap-2'>
        <img className='rounded-full h-28 w-28 object-cover cursor-pointer self-center my-3' src={formData.avatar || currentUser.avatar} alt='Profile'/>
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input onChange={ (e) => { setFile(e.target.files[0]) } } className='mb-2 text-sm' type='file' accept='image/*'/>
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
