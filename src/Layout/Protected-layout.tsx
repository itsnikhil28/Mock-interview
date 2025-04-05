import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
    return (
        <div className='flex flex-col h-screen'>
            <ScrollToTop />
            <Header />
            <Container className="grow">
                <main className="grow"></main>
                <Outlet />
            </Container>
            <Footer />
        </div>
    )
}
