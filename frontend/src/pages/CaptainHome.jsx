import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'
import LiveTracking from '../components/LiveTracking'

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ride, setRide] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        socket.emit('join', { userId: captain._id, userType: 'captain' })

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: { ltd: position.coords.latitude, lng: position.coords.longitude }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        return () => clearInterval(locationInterval)
    }, [])

    socket.on('new-ride', (data) => {
        setRide(data)
        setRidePopupPanel(true)
    })

    async function confirmRide() {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
            rideId: ride._id,
            captainId: captain._id,
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)
    }

    useGSAP(function () {
        gsap.to(ridePopupPanelRef.current, { transform: ridePopupPanel ? 'translateY(0)' : 'translateY(100%)' })
    }, [ridePopupPanel])

    useGSAP(function () {
        gsap.to(confirmRidePopupPanelRef.current, { transform: confirmRidePopupPanel ? 'translateY(0)' : 'translateY(100%)' })
    }, [confirmRidePopupPanel])

    return (
        <div className='h-screen flex flex-col lg:flex-row overflow-hidden'>

            {/* ─── DESKTOP SIDEBAR ─── */}
            <div className='hidden lg:flex lg:w-[400px] xl:w-[460px] flex-col bg-white shadow-xl z-10 overflow-y-auto'>
                {/* Header */}
                <div className='flex items-center justify-between px-6 py-4 border-b'>
                    <img className='w-20' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                    <Link to='/captain-home' className='h-10 w-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 transition'>
                        <i className="text-lg font-medium ri-logout-box-r-line"></i>
                    </Link>
                </div>

                {/* Captain stats */}
                <div className='px-6 py-4 border-b'>
                    <CaptainDetails />
                </div>

                {/* Active ride popups inside sidebar */}
                {confirmRidePopupPanel && (
                    <div className='px-4 py-4 flex-1 overflow-y-auto'>
                        <ConfirmRidePopUp ride={ride} setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
                    </div>
                )}
                {ridePopupPanel && !confirmRidePopupPanel && (
                    <div className='px-4 py-4 flex-1 overflow-y-auto'>
                        <RidePopUp ride={ride} setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} confirmRide={confirmRide} />
                    </div>
                )}
                {!ridePopupPanel && !confirmRidePopupPanel && (
                    <div className='px-6 py-8 text-center text-gray-400 flex-1 flex flex-col items-center justify-center'>
                        <i className="ri-car-line text-6xl mb-4 text-gray-300"></i>
                        <p className='text-lg font-medium text-gray-500'>Waiting for rides...</p>
                        <p className='text-sm mt-1'>New ride requests will appear here</p>
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

                {/* Mobile: captain details strip */}
                <div className='lg:hidden absolute bottom-0 left-0 right-0 bg-white p-5 shadow-lg rounded-t-3xl'>
                    <CaptainDetails />
                </div>

                {/* Mobile bottom sheets */}
                <div ref={ridePopupPanelRef} className='lg:hidden fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 rounded-t-3xl shadow-xl'>
                    <RidePopUp ride={ride} setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} confirmRide={confirmRide} />
                </div>
                <div ref={confirmRidePopupPanelRef} className='lg:hidden fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                    <ConfirmRidePopUp ride={ride} setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
                </div>
            </div>
        </div>
    )
}

export default CaptainHome