import { cn } from "@/lib/utils"
import Container from "./Container"
import LogoContainer from "./LogoContainer"
import NavigationRoutes from "./Navigation-routes"
import ProfileContainer from "./ProfileContainer"
import ToggleContainer from "./ToggleContainer"
import { useUser } from "@/provider/User-Provider"
import Interviewerdashboardbtn from "./Interviewer-dashboard-btn"

export default function Header() {
    const { role } = useUser()
    return (
        <header className={cn('w-full border-b duration-150 transition-all ease-in-out')} id="header">
            <Container>
                <div className="flex items-center gap-4 w-full">
                    {/* logo */}
                    <LogoContainer />

                    {/* navigation */}
                    <nav className="hidden md:flex items-center gap-3">
                        <NavigationRoutes />
                    </nav>

                    <div className="ml-auto flex items-center gap-6">
                        {/* {interviewerbtn} */}
                        {role && role === 'interviewer' && (
                            <Interviewerdashboardbtn />
                        )}
                        {/* profile */}
                        <ProfileContainer />

                        {/* mobile profile */}
                        <ToggleContainer />
                    </div>
                </div>
            </Container>
        </header>
    )
}

