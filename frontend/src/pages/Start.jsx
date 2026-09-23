import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className='h-screen flex'>
      {/* Left panel — hero image, hidden on mobile */}
      <div className='hidden lg:block lg:w-1/2 bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop)] relative'>
        <div className='absolute inset-0 bg-black/40' />
        <div className='absolute bottom-12 left-10 text-white'>
          <h1 className='text-5xl font-bold leading-tight'>Move the world,<br />your way.</h1>
          <p className='mt-3 text-lg text-gray-200'>Request a ride, hop in, and go.</p>
        </div>
      </div>

      {/* Right panel — CTA */}
      <div className='w-full lg:w-1/2 bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop)] lg:bg-none flex flex-col justify-between lg:justify-center lg:px-16 lg:bg-white'>
        {/* Mobile overlay */}
        <div className='lg:hidden absolute inset-0 bg-black/30 pointer-events-none' />

        <div className='relative z-10 px-6 pt-10 lg:pt-0'>
          <img
            className='w-20 lg:w-24'
            src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417"
            alt="Uber"
          />
        </div>

        <div className='relative z-10 bg-white lg:bg-transparent rounded-t-3xl lg:rounded-none px-6 py-8 lg:py-0 mt-auto lg:mt-0'>
          <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-2'>Get Started with Uber</h2>
          <p className='text-gray-500 mb-6'>Your city. Your ride. Any time.</p>
          <Link
            to='/login'
            className='flex items-center justify-center w-full bg-black text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-900 transition-colors'
          >
            Continue as User
          </Link>
          <Link
            to='/captain-login'
            className='flex items-center justify-center w-full bg-[#10b461] text-white py-3 rounded-xl text-lg font-semibold mt-3 hover:bg-green-700 transition-colors'
          >
            Continue as Captain
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Start