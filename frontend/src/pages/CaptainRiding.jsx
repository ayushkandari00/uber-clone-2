import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride

    useGSAP(function () {
        gsap.to(finishRidePanelRef.current, { transform: finishRidePanel ? 'translateY(0)' : 'translateY(100%)' })
    }, [finishRidePanel])

    return (
        <div className='h-screen flex flex-col lg:flex-row overflow-hidden'>

            {/* ─── DESKTOP SIDEBAR ─── */}
            <div className='hidden lg:flex lg:w-[400px] xl:w-[460px] flex-col bg-white shadow-xl z-10'>
                {/* Header */}
                <div className='flex items-center justify-between px-6 py-4 border-b'>
                    <img className='w-20' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                    <Link to='/captain-home' className='h-10 w-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 transition'>
                        <i className="text-lg ri-logout-box-r-line"></i>
                    </Link>
                </div>

                {/* Ride strip */}
                <div
                    className='mx-4 mt-4 bg-yellow-400 rounded-xl p-5 cursor-pointer flex items-center justify-between hover:bg-yellow-500 transition-colors'
                    onClick={() => setFinishRidePanel(true)}
                >
                    <div>
                        <p className='text-sm font-medium text-yellow-900'>En route to destination</p>
                        <h4 className='text-xl font-bold mt-1'>4 KM away</h4>
                    </div>
                    <button className='bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors'>
                        Complete Ride
                    </button>
                </div>

                {/* FinishRide inside sidebar when open on desktop */}
                {finishRidePanel && (
                    <div className='px-4 py-4 flex-1 overflow-y-auto border-t mt-4'>
                        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
                    </div>
                )}
            </div>

            {/* ─── MAP AREA ─── */}
            <div className='flex-1 relative'>
                {/* Mobile header */}
                <div className='lg:hidden fixed p-4 top-0 flex items-center justify-between w-full z-10 bg-white/80 backdrop-blur-sm'>
                    <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                    <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full shadow'>
                        <i className="text-lg font-medium ri-logout-box-r-line"></i>
                    </Link>
                </div>

                {/* Map */}
                <div className='h-full w-full'>
                    <LiveTracking />
                </div>

                {/* Mobile ride strip */}
                <div
                    className='lg:hidden absolute bottom-0 left-0 right-0 bg-yellow-400 p-5 flex items-center justify-between cursor-pointer'
                    onClick={() => setFinishRidePanel(true)}
                >
                    <h5 className='absolute top-2 left-1/2 -translate-x-1/2'>
                        <i className="text-2xl text-yellow-700 ri-arrow-up-wide-line"></i>
                    </h5>
                    <h4 className='text-xl font-semibold mt-2'>4 KM away</h4>
                    <button className='bg-green-600 text-white font-semibold py-2 px-8 rounded-lg'>
                        Complete Ride
                    </button>
                </div>

                {/* Mobile FinishRide panel */}
                <div ref={finishRidePanelRef} className='lg:hidden fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12 rounded-t-3xl shadow-xl'>
                    <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
                </div>
            </div>
        </div>
    )
}

export default CaptainRiding