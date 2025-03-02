import Footer from '@/components/Footer'
import Header from '@/components/Header'
import AuthHandler from '@/handlers/Auth-handler'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
    return (
        <div className='w-full'>

            <AuthHandler />
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}
