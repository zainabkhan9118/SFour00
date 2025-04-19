import React, { useState } from 'react';
import logo from '../assets/images/logo.png';
import { HiArrowRight } from 'react-icons/hi';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email] = useState('emailaddress@gmail.com');

  const handleVerification = (e) => {
    e.preventDefault();
    // Add your verification logic here
    console.log('Verifying code:', verificationCode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="max-w-md w-full p-6 space-y-4 bg-white rounded-lg ">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-lg flex items-center justify-center">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="mt-6 text-center text-[32px] font-bold text-[#1F2B44]">
          Email Verification
        </h2>

        {/* Description */}
        <p className="text-center text-[15px] bold-[400px] text-gray-600 font-poppins" >
          We've sent an verification to {email} to<br />
          verify your email address and activate your account.
        </p>

        {/* Verification Form */}
        <form onSubmit={handleVerification} className="mt-8 space-y-6">
          <div>
            <input
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm rounded-[120px]"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>

          <div>
          <button
  type="submit"
  className="group relative w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent text-[14px]  text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 rounded-full"
>
  <span className="flex items-center gap-2">
    Verify My Account
    <HiArrowRight className="w-4 h-4" />
  </span>
</button>
          </div>
        </form>

        {/* Resend Link */}
        <div className="text-center text-sm">
          <span className="text-gray-600">Didn't receive any code! </span>
          <a href="#" className="font-medium text-orange-500 hover:text-orange-400">
            Resends
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;