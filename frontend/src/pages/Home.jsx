import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import { SocketContext } from '../context/SocketContext'
import { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [activeField, setActiveField] = useState(null)
    const [fare, setFare] = useState({})
    const [vehicleType, setVehicleType] = useState(null)
    const [ride, setRide] = useState(null)

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        socket.emit('join', { userType: 'user', userId: user._id })
    }, [user])

    socket.on('ride-confirmed', ride => {
        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } })
    })

    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setPickupSuggestions(response.data)
        } catch { }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setDestinationSuggestions(response.data)
        } catch { }
    }

    const submitHandler = (e) => { e.preventDefault() }

    // ── Mobile GSAP animations (no-op on desktop since panels are in sidebar) ──
    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, { height: '70%', padding: 24 })
            gsap.to(panelCloseRef.current, { opacity: 1 })
        } else {
            gsap.to(panelRef.current, { height: '0%', padding: 0 })
            gsap.to(panelCloseRef.current, { opacity: 0 })
        }
    }, [panelOpen])

    useGSAP(function () {
        gsap.to(vehiclePanelRef.current, { transform: vehiclePanel ? 'translateY(0)' : 'translateY(100%)' })
    }, [vehiclePanel])

    useGSAP(function () {
        gsap.to(confirmRidePanelRef.current, { transform: confirmRidePanel ? 'translateY(0)' : 'translateY(100%)' })
    }, [confirmRidePanel])

    useGSAP(function () {
        gsap.to(vehicleFoundRef.current, { transform: vehicleFound ? 'translateY(0)' : 'translateY(100%)' })
    }, [vehicleFound])

    useGSAP(function () {
        gsap.to(waitingForDriverRef.current, { transform: waitingForDriver ? 'translateY(0)' : 'translateY(100%)' })
    }, [waitingForDriver])

    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setFare(response.data)
    }

    async function createRide() {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup, destination, vehicleType
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
    }

    // Active sidebar content for desktop
    const getSidebarContent = () => {
        if (waitingForDriver) return <WaitingForDriver ride={ride} setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver} />
        if (vehicleFound) return <LookingForDriver createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} />
        if (confirmRidePanel) return <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
        if (vehiclePanel) return <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
        return null
    }

    const desktopSidebarContent = getSidebarContent()

    return (
        <div className='h-screen flex flex-col lg:flex-row overflow-hidden'>

            {/* ─── DESKTOP SIDEBAR ─── */}
            <div className='hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col bg-white shadow-xl z-10 overflow-y-auto'>
                {/* Header */}
                <div className='flex items-center justify-between px-6 py-4 border-b'>
                    <img className='w-20' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                        <i className="ri-user-3-line text-lg"></i>
                        <span className='font-medium text-gray-800'>{user?.fullname?.firstname}</span>
                    </div>
                </div>

                {/* Search form */}
                <div className='px-6 py-5'>
                    <h4 className='text-2xl font-bold mb-4'>Find a trip</h4>
                    <form className='relative' onSubmit={submitHandler}>
                        <div className='absolute h-14 w-0.5 top-[50%] -translate-y-1/2 left-3 bg-gray-700 rounded-full z-10' />
                        <input
                            onClick={() => { setPanelOpen(true); setActiveField('pickup') }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-gray-100 pl-8 pr-4 py-3 text-base rounded-xl w-full mb-2 focus:outline-none focus:ring-2 focus:ring-black transition'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => { setPanelOpen(true); setActiveField('destination') }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-gray-100 pl-8 pr-4 py-3 text-base rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black transition'
                            type="text"
                            placeholder='Enter your destination'
                        />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-3 rounded-xl mt-3 w-full font-semibold text-base hover:bg-gray-900 transition-colors'
                    >
                        Find Trip
                    </button>
                </div>

                {/* Suggestions */}
                {panelOpen && (
                    <div className='px-6 pb-4 flex-1 overflow-y-auto'>
                        <LocationSearchPanel
                            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                            setPanelOpen={setPanelOpen}
                            setVehiclePanel={setVehiclePanel}
                            setPickup={setPickup}
                            setDestination={setDestination}
                            activeField={activeField}
                        />
                    </div>
                )}

                {/* Desktop panel content (vehicle select / confirm / looking / waiting) */}
                {desktopSidebarContent && !panelOpen && (
                    <div className='px-6 pb-6 flex-1 overflow-y-auto border-t pt-4'>
                        {desktopSidebarContent}
                    </div>
                )}
            </div>

            {/* ─── MAP AREA (desktop: fills remaining space; mobile: full screen bg) ─── */}
            <div className='flex-1 relative'>
                {/* Mobile top logo */}
                <img className='w-16 absolute left-5 top-5 z-10 lg:hidden' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />

                <div className='h-screen w-full'>
                    <LiveTracking />
                </div>

                {/* ─── MOBILE BOTTOM SHEETS ─── */}
                <div className='lg:hidden flex flex-col justify-end h-screen absolute top-0 w-full pointer-events-none'>
                    <div className='pointer-events-auto'>
                        <div className='h-[30%] p-6 bg-white relative'>
                            <h5 ref={panelCloseRef} onClick={() => setPanelOpen(false)} className='absolute opacity-0 right-6 top-6 text-2xl cursor-pointer'>
                                <i className="ri-arrow-down-wide-line"></i>
                            </h5>
                            <h4 className='text-2xl font-semibold'>Find a trip</h4>
                            <form className='relative py-3' onSubmit={submitHandler}>
                                <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                                <input
                                    onClick={() => { setPanelOpen(true); setActiveField('pickup') }}
                                    value={pickup}
                                    onChange={handlePickupChange}
                                    className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                                    type="text"
                                    placeholder='Add a pick-up location'
                                />
                                <input
                                    onClick={() => { setPanelOpen(true); setActiveField('destination') }}
                                    value={destination}
                                    onChange={handleDestinationChange}
                                    className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3'
                                    type="text"
                                    placeholder='Enter your destination'
                                />
                            </form>
                            <button onClick={findTrip} className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                                Find Trip
                            </button>
                        </div>
                        <div ref={panelRef} className='bg-white h-0 overflow-y-auto'>
                            <div className='px-4'>
                                <LocationSearchPanel
                                    suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                                    setPanelOpen={setPanelOpen}
                                    setVehiclePanel={setVehiclePanel}
                                    setPickup={setPickup}
                                    setDestination={setDestination}
                                    activeField={activeField}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div ref={vehiclePanelRef} className='lg:hidden fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                    <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
                </div>
                <div ref={confirmRidePanelRef} className='lg:hidden fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                    <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
                </div>
                <div ref={vehicleFoundRef} className='lg:hidden fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                    <LookingForDriver createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} />
                </div>
                <div ref={waitingForDriverRef} className='lg:hidden fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12'>
                    <WaitingForDriver ride={ride} setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver} />
                </div>
            </div>
        </div>
    )
}

export default Home