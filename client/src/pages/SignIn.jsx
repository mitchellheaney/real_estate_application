import React, { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // e is the element that trigerred an onChange event
  // to get the id of the element --> e.target.id
  // to update its value --> e.target.value
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();           // prevents refresh on submit
      dispatch(signInStart());
      const result = await fetch("/server/auth/sign-in",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      const data = await result.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
      
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
    
  }

  return (
    <div className='p-4 max-w-lg mx-auto'>
      <h1 className='text-center text-4xl font-semibold my-8'>
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={handleChange} type='text' placeholder='Username' id='username' className='border rounded-lg p-3'/> 
        <input onChange={handleChange} type='password' placeholder='Password' id='password' className='border rounded-lg p-3'/> 
        <button disabled={loading} className='bg-slate-600 p-3 rounded-lg text-white font-semibold transform transition duration-300 hover:scale-105 hover:bg-slate-500'>
          {loading ? "Loading..." : "SIGN IN"}
        </button>
      </form>
      <div className='flex justify-center mt-5 gap-1'>
        <p>Have no account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-500'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}
