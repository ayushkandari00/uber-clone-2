import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

const CaptainSignup = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [vehicleType, setVehicleType] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = {
      fullname: { firstname: firstName, lastname: lastName },
      email,
      password,
      vehicle: { color: vehicleColor, plate: vehiclePlate, capacity: vehicleCapacity, vehicleType }
    }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)
    if (response.status === 201) {
      const data = response.data
      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')
    }
    setEmail(''); setFirstName(''); setLastName(''); setPassword('')
    setVehicleColor(''); setVehiclePlate(''); setVehicleCapacity(''); setVehicleType('')
  }

  return (
    <div className='min-h-screen flex'>
      {/* Left branding panel — desktop only */}
      <div className='hidden lg:flex lg:w-2/5 bg-[#1a1a1a] text-white flex-col justify-between p-14 sticky top-0 h-screen'>
        <img className='w-20' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="Uber Captain" />
        <div>
          <h1 className='text-5xl font-bold leading-tight mb-4'>Become a<br />Captain.</h1>
          <p className='text-gray-400 text-lg'>Register your vehicle and start earning on your schedule.</p>
        </div>
        <p className='text-gray-600 text-sm'>© 2024 Uber Technologies Inc.</p>
      </div>

      {/* Right form panel */}
      <div className='w-full lg:w-3/5 overflow-y-auto'>
        <div className='p-7 lg:p-14 flex flex-col justify-between min-h-screen'>
          <div>
            {/* Mobile logo */}
            <img className='w-20 mb-8 lg:hidden' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />

            <h2 className='hidden lg:block text-3xl font-bold mb-8'>Create Captain Account</h2>

            <form onSubmit={submitHandler}>
              {/* Name */}
              <h3 className='text-lg font-medium mb-2'>Captain's Name</h3>
              <div className='flex gap-4 mb-5'>
                <input required className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-3 border text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-black transition' type="text" placeholder='First name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <input required className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-3 border text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-black transition' type="text" placeholder='Last name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>

              {/* Email */}
              <h3 className='text-lg font-medium mb-2'>Email</h3>
              <input required value={email} onChange={(e) => setEmail(e.target.value)} className='bg-[#eeeeee] mb-5 rounded-lg px-4 py-3 border w-full text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-black transition' type="email" placeholder='email@example.com' />

              {/* Password */}
              <h3 className='text-lg font-medium mb-2'>Password</h3>
              <input className='bg-[#eeeeee] mb-5 rounded-lg px-4 py-3 border w-full text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-black transition' value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder='password' />

              {/* Vehicle info */}
              <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
              <div className='grid grid-cols-2 gap-4 mb-5'>
                <input required className='bg-[#eeeeee] rounded-lg px-4 py-3 border text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-black transition' type="text" placeholder='Vehicle Color' value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} />
                <input required className='bg-[#eeeeee] rounded-lg px-4 py-3 border text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-black transition' type="text" placeholder='Vehicle Plate' value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} />
                <input required className='bg-[#eeeeee] rounded-lg px-4 py-3 border text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-black transition' type="number" placeholder='Capacity' value={vehicleCapacity} onChange={(e) => setVehicleCapacity(e.target.value)} />
                <select required className='bg-[#eeeeee] rounded-lg px-4 py-3 border text-base focus:outline-none focus:ring-2 focus:ring-black transition' value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                  <option value="" disabled>Vehicle Type</option>
                  <option value="car">Car</option>
                  <option value="auto">Auto</option>
                  <option value="moto">Moto</option>
                </select>
              </div>

              <button className='bg-[#111] text-white font-semibold mb-4 rounded-xl px-4 py-3 w-full text-lg hover:bg-gray-800 transition-colors'>
                Create Captain Account
              </button>
            </form>

            <p className='text-center text-sm'>
              Already have an account?{' '}
              <Link to='/captain-login' className='text-blue-600 font-medium hover:underline'>Login here</Link>
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
    </div>
  )
}

export default CaptainSignup