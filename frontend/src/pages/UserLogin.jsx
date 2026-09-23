import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    const userData = { email, password }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
    if (response.status === 200) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }
    setEmail('')
    setPassword('')
  }

  return (
    <div className='min-h-screen flex'>
      {/* Left branding panel — desktop only */}
      <div className='hidden lg:flex lg:w-1/2 bg-black text-white flex-col justify-between p-14'>
        <img
          className='w-20'
          src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417"
          alt="Uber"
        />
        <div>
          <h1 className='text-5xl font-bold leading-tight mb-4'>Welcome<br />back.</h1>
          <p className='text-gray-400 text-lg'>Sign in to continue your journey.</p>
        </div>
        <p className='text-gray-600 text-sm'>© 2024 Uber Technologies Inc.</p>
      </div>

      {/* Right form panel */}
      <div className='w-full lg:w-1/2 flex flex-col justify-between p-7 lg:p-14 lg:justify-center'>
        <div>
          {/* Mobile logo */}
          <img
            className='w-16 mb-10 lg:hidden'
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
            alt=""
          />

          <h2 className='hidden lg:block text-3xl font-bold mb-8'>Sign in</h2>

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
            New here?{' '}
            <Link to='/signup' className='text-blue-600 font-medium hover:underline'>Create new Account</Link>
          </p>
        </div>

        <div className='mt-8'>
          <Link
            to='/captain-login'
            className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-xl px-4 py-3 w-full text-lg hover:bg-green-700 transition-colors'
          >
            Sign in as Captain
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserLogin