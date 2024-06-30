import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import Sidebar from '../components/SideBar.jsx'
// import logo from '../assets/logo.png'
import io from 'socket.io-client'

const Home = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const token = useSelector((state) => state.user.token)

    const isLogin = () => {
        if(!localStorage.getItem('token')){
            navigate('/email')
        }
    }

    // console.log('user', user)
    const fetchUserDetails = async () => {
        try {
            const URL = `/api/user-details`
            const response = await axios({
                url: URL,
                withCredentials: true
            })

            dispatch(setUser(response.data.data))

            if (response.data.data.logout) {
                dispatch(logout())
                navigate("/email")
            }
            // console.log("current user Details", response)
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        isLogin()
        fetchUserDetails()
    }, [])

    /***socket connection */
    useEffect(() => {
        const Connection = io(import.meta.env.VITE_BACKEND_URL, {
            auth: {
                token: localStorage.getItem('token')
            },
        })

        Connection.on('onlineUser', (onlineUsers) => {
            // console.log(onlineUsers)
            dispatch(setOnlineUser(onlineUsers))
        })

        dispatch(setSocketConnection(Connection))

        return () => {
            Connection.disconnect()
        }
    }, [])


    const basePath = location.pathname === '/'
    return (
        <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
            <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
                <Sidebar />
            </section>

            {/**message component**/}
            <section className={`${basePath && "hidden"}`} >
                <Outlet />
            </section>


            <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
                <div>
                    <img
                        src='./logo.png'
                        width={250}
                        alt='logo'
                    />
                </div>
                <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
            </div>
        </div>
    )
}

export default Home
