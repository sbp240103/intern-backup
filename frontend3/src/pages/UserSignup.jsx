import React, { useContext } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import jwtDecode from 'jwt-decode'; // Use default import for older versions

const UserSignup = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log('Google Sign In Success', credentialResponse);

      // Decode the JWT to extract user information
      const decodedToken = jwtDecode(credentialResponse.credential);
      const { name, email } = decodedToken;

      console.log('Decoded Token:', decodedToken);
      console.log('User Name:', name);
      console.log('User Email:', email);

      // Store email in context
      setUser({ email });
      console.log('Email set in context:', email);

      // Send the user data to the backend
      const response = await fetch('http://localhost:3000/catalog/author/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${credentialResponse.credential}`,
        },
        body: JSON.stringify({
          name: name,
          email: email,
          summary: `My name is ${name} and I signed up using Google.`,
        }),
      });

      // if (!response.ok) {
      //   throw new Error(`Failed to store user data: ${response.statusText}`);
      // }

      console.log('User data stored successfully!');

      // Navigate to the contact page
      console.log('Navigating to /contact...');
      navigate('/contact');
    } catch (error) {
      console.error('Error in handleSuccess:', error);
    }
  };

  const handleError = (error) => {
    console.log('Google Sign In Error', error);
  };

  return (
    <div>
      <div className="p-7 h-screen flex flex-col justify-between">
        <div>
          <img
            className="w-16 mb-10"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
            alt=""
          />
          <p className="text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600">
              Login here
            </Link>
          </p>
        </div>
        <GoogleOAuthProvider clientId="590577612365-ha7qrqb1ebd1v7mjv9ramlk73ctk9k10.apps.googleusercontent.com">
          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
          </div>
        </GoogleOAuthProvider>
        <div>
          <p className="text-[10px] leading-tight">
            This site is protected by reCAPTCHA and the{' '}
            <span className="underline">Google Privacy Policy</span> and{' '}
            <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;