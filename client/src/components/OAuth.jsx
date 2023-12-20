import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

export function OAuth() {

	const dispatch = useDispatch();
	const handleGoogleClick = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const auth = getAuth(app);

			const result = await signInWithPopup(auth, provider);
			const res = await fetch("/server/auth/google", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( { name: result.user.displayName, email: result.user.email, photo: result.user.photoURL } ),
			});
			const data = await res.json();
			dispatch(signInSuccess(data));

		} catch(error) {
			console.log('Could not login with Google.', error);
		}
	}

  return (
		<button onClick={handleGoogleClick}
		type='button'
		className='bg-red-500 p-3 rounded-lg text-white font-semibold transform transition duration-300 hover:scale-105 hover:bg-red-300'
		>
			SIGN IN WITH GOOGLE
		</button>
  )
}
