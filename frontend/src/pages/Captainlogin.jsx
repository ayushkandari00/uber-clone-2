import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext'

const Captainlogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = { email, password }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captainData)
    if (response.status === 200) {
      const data = response.data
      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')
    }
    setEmail('')
    setPassword('')
  }

  return (
    <div className='min-h-screen flex'>
      {/* Left branding panel — desktop only */}
      <div className='hidden lg:flex lg:w-1/2 bg-[#1a1a1a] text-white flex-col justify-between p-14'>
        <img
          className='w-20'
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt="Uber Captain"
        />
        <div>
          <h1 className='text-5xl font-bold leading-tight mb-4'>Drive with<br />Uber.</h1>
          <p className='text-gray-400 text-lg'>Sign in to your Captain account and start earning.</p>
        </div>
        <p className='text-gray-600 text-sm'>© 2024 Uber Technologies Inc.</p>
      </div>

      {/* Right form panel */}
      <div className='w-full lg:w-1/2 flex flex-col justify-between p-7 lg:p-14 lg:justify-center'>
        <div>
          {/* Mobile logo */}
          <img className='w-20 mb-8 lg:hidden' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />

          <h2 className='hidden lg:block text-3xl font-bold mb-8'>Captain Sign In</h2>

          <form onSubmit={submitHandler}>
            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-[#eeeeee] mb-6 rounded-lg px-4 py-3 border w-full text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-black transition'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
            <input
              className='bg-[#eeeeee] mb-6 rounded-lg px-4 py-3 border w-full text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-black transition'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder='password'
            />

            <button className='bg-[#111] text-white font-semibold mb-4 rounded-xl px-4 py-3 w-full text-lg hover:bg-gray-800 transition-colors'>
              Login
            </button>
          </form>

          <p className='text-center text-sm'>
            Join a fleet?{' '}
            <Link to='/captain-signup' className='text-blue-600 font-medium hover:underline'>Register as a Captain</Link>
          </p>
        </div>

        <div className='mt-8'>
          <Link
            to='/login'
            className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-xl px-4 py-3 w-full text-lg hover:bg-orange-700 transition-colors'
          >
            Sign in as User
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Captainlogin