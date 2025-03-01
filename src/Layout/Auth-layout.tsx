import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
    return (
        <div className='w-screen h-screen overflow-hidden flex items-center justify-center relative'>
            <img src="/assets/img/bg.png" className='absolute w-full h-full object-cover opacity-30' alt="" />
            <Outlet />
        </div>
    )
}
