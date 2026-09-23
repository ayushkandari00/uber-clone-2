import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {}
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    socket.on('ride-ended', () => { navigate('/home') })

    return (
        <div className='h-screen flex flex-col lg:flex-row overflow-hidden'>

            {/* ─── DESKTOP SIDEBAR ─── */}
            <div className='hidden lg:flex lg:w-[400px] xl:w-[460px] flex-col bg-white shadow-xl z-10'>
                {/* Header */}
                <div className='flex items-center justify-between px-6 py-4 border-b'>
                    <img className='w-20' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                    <Link to='/home' className='h-10 w-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 transition'>
                        <i className="text-lg ri-home-5-line"></i>
                    </Link>
                </div>

                {/* Ride info */}
                <div className='px-6 py-6 flex-1 overflow-y-auto'>
                    <div className='flex items-center justify-between mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200'>
                        <img className='h-16 w-24 object-cover rounded-lg' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                        <div className='text-right'>
                            <h2 className='text-lg font-semibold capitalize'>{ride?.captain?.fullname?.firstname}</h2>
                            <h4 className='text-xl font-bold -mt-1'>{ride?.captain?.vehicle?.plate}</h4>
                            <p className='text-sm text-gray-500'>Your Captain</p>
                        </div>
                    </div>

                    <div className='space-y-0 border rounded-xl overflow-hidden'>
                        <div className='flex items-center gap-4 p-4 border-b bg-gray-50'>
                            <i className="ri-map-pin-2-fill text-xl text-green-600"></i>
                            <div>
                                <p className='text-xs text-gray-400 uppercase tracking-wide'>Destination</p>
                                <h3 className='font-medium'>{ride?.destination}</h3>
                            </div>
                        </div>
                        <div className='flex items-center gap-4 p-4 bg-gray-50'>
                            <i className="ri-currency-line text-xl text-blue-600"></i>
                            <div>
                                <p className='text-xs text-gray-400 uppercase tracking-wide'>Fare</p>
                                <h3 className='font-semibold text-lg'>₹{ride?.fare}</h3>
                            </div>
                        </div>
                    </div>

                    <button className='w-full mt-6 bg-green-600 text-white font-semibold p-3 rounded-xl hover:bg-green-700 transition-colors'>
                        Make a Payment
                    </button>
                </div>
            </div>

            {/* ─── MAP AREA ─── */}
            <div className='flex-1 relative'>
                {/* Mobile home button */}
                <Link to='/home' className='lg:hidden fixed right-4 top-4 h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md z-10'>
                    <i className="text-lg font-medium ri-home-5-line"></i>
                </Link>

                {/* Map */}
                <div className='h-full w-full'>
                    <LiveTracking />
                </div>

                {/* Mobile ride card */}
                <div className='lg:hidden absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl p-5'>
                    <div className='flex items-center justify-between mb-4'>
                        <img className='h-12 rounded-lg' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                        <div className='text-right'>
                            <h2 className='text-lg font-medium capitalize'>{ride?.captain?.fullname?.firstname}</h2>
                            <h4 className='text-xl font-semibold -mt-1'>{ride?.captain?.vehicle?.plate}</h4>
                            <p className='text-sm text-gray-500'>Maruti Suzuki Alto</p>
                        </div>
                    </div>
                    <div className='border rounded-xl overflow-hidden mb-4'>
                        <div className='flex items-center gap-4 p-3 border-b'>
                            <i className="ri-map-pin-2-fill text-lg"></i>
                            <div>
                                <h3 className='text-base font-medium'>Destination</h3>
                                <p className='text-sm text-gray-500'>{ride?.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4 p-3'>
                            <i className="ri-currency-line text-lg"></i>
                            <div>
                                <h3 className='text-base font-medium'>₹{ride?.fare}</h3>
                                <p className='text-sm text-gray-500'>Cash</p>
                            </div>
                        </div>
                    </div>
                    <button className='w-full bg-green-600 text-white font-semibold p-3 rounded-xl'>Make a Payment</button>
                </div>
            </div>
        </div>
    )
}

export default Riding