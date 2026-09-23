import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const navigate = useNavigate()
  const { user, setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const newUser = {
      fullname: { firstname: firstName, lastname: lastName },
      email,
      password
    }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)
    if (response.status === 201) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }
    setEmail(''); setFirstName(''); setLastName(''); setPassword('')
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
          <h1 className='text-5xl font-bold leading-tight mb-4'>Start your<br />journey today.</h1>
          <p className='text-gray-400 text-lg'>Create your free account and ride in minutes.</p>
        </div>
        <p className='text-gray-600 text-sm'>© 2024 Uber Technologies Inc.</p>
      </div>

      {/* Right form panel */}
      <div className='w-full lg:w-1/2 flex flex-col justify-between p-7 lg:p-14 overflow-y-auto'>
        <div>
          {/* Mobile logo */}
          <img
            className='w-16 mb-8 lg:hidden'
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
            alt=""
          />

          <h2 className='hidden lg:block text-3xl font-bold mb-8'>Create your account</h2>

          <form onSubmit={submitHandler}>
            <h3 className='text-lg font-medium mb-2'>What's your name</h3>
            <div className='flex gap-4 mb-5'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-3 border text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-black transition'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-3 border text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-black transition'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-[#eeeeee] mb-5 rounded-lg px-4 py-3 border w-full text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-black transition'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
            <input
              className='bg-[#eeeeee] mb-5 rounded-lg px-4 py-3 border w-full text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-black transition'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder='password'
            />

            <button className='bg-[#111] text-white font-semibold mb-4 rounded-xl px-4 py-3 w-full text-lg hover:bg-gray-800 transition-colors'>
              Create account
            </button>
          </form>

          <p className='text-center text-sm'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600 font-medium hover:underline'>Login here</Link>
          </p>
        </div>

        <div className='mt-6'>
          <p className='text-[10px] leading-tight text-gray-400'>
            This site is protected by reCAPTCHA and the{' '}
            <span className='underline'>Google Privacy Policy</span> and{' '}
            <span className='underline'>Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserSignup