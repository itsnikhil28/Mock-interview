import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollToTop'
import AuthHandler from '@/handlers/Auth-handler'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
    return (
        <div className='w-full'>
            <ScrollToTop />

            <AuthHandler>
                <Header />
                <Outlet />
                <Footer />
            </AuthHandler>
        </div>
    )
}
