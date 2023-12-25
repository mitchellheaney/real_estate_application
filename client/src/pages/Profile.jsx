import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/server/auth/sign-out');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (err) {
      dispatch(signOutUserFailure(err.message));
    }
  }

  const handleDelete = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/server/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      
      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch(err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  };

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
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <img className='rounded-full h-28 w-28 object-cover cursor-pointer self-center my-3 hover:scale-150 transition duration-150' src={formData.avatar || currentUser.avatar} alt='Profile'/>
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
        <input onChange={ (e) => { setFile(e.target.files[0]) } }
          className='mb-2 text-sm'
          type='file'
          accept='image/*'
        />
        <input type='text'
          id='username'
          placeholder='Username'
          className='border p-3 rounded-lg'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input type='text'
          id='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input type='password'
          id='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-600 p-3 mt-2 rounded-lg text-white font-semibold transform transition duration-300 hover:scale-105 hover:bg-slate-500'>
          {loading ? 'Loading...' : 'UPDATE'}
        </button>
        <Link className='text-white bg-green-600 p-3 rounded-lg text-center font-semibold transition duration-300 hover:scale-105 hover:bg-green-500 hover:opacity-90' to={"/create-listing"}>CREATE LISTING</Link>
      </form>
      <div className='flex mt-3 justify-between'>
        <button onClick={handleDelete} className='bg-red-500 text-m p-2 mt-2 rounded-lg text-white transform transition duration-300 hover:scale-105 hover:bg-red-400'>Delete Account</button>
        <button onClick={handleSignOut} className='bg-red-500 text-m p-2 mt-2 rounded-lg text-white transform transition duration-300 hover:scale-105 hover:bg-red-400'>Sign Out</button>
      </div>
      <p className='text-red-600 mt-5'>{error ? error : ""}</p>
      <p className='text-green-500'>{updateSuccess ? "User updated successfully." : ""}</p>
    </div>
  )
}
