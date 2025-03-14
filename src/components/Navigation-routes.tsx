import { useUser } from "@/provider/User-Provider"
import { MainRoutes } from "@/lib/helper"
import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/clerk-react"
import { NavLink } from "react-router-dom"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"

interface NavigationRoutesProps {
    isMobile?: boolean
}

export default function NavigationRoutes({ isMobile = false }: NavigationRoutesProps) {
    const { userId } = useAuth()
    const { role } = useUser()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    return (
        <ul className={cn("flex items-center gap-6", isMobile && 'mt-[25px] items-center flex-col gap-8')}>
            {MainRoutes.map((item, i) => (
                <NavLink key={i} to={item.href} className={({ isActive }) => cn('text-base text-neutral-600', isActive && 'text-neutral-900 font-semibold')}>{item.label}</NavLink>
            ))}

            {userId && role == 'candidate' && (
                <>
                    <NavLink to={'/resume'} className={({ isActive }) => cn('text-base text-neutral-600', isActive && 'text-neutral-900 font-semibold')}>Make Resume</NavLink>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-base text-neutral-600 hover:text-neutral-900 cursor-pointer">
                                <div className="flex gap-2 items-center">
                                    Manage Interviews {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <NavLink to={'/generate'} className={({ isActive }) => cn('text-base text-neutral-600', isActive && 'text-neutral-900 font-semibold')} onClick={() => setIsDropdownOpen(false)}>AI-Powered Mock Interview</NavLink>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <NavLink to={'/candidate-dashboard'} className={({ isActive }) => cn('text-base text-neutral-600', isActive && 'text-neutral-900 font-semibold')} onClick={() => setIsDropdownOpen(false)}>Scheduled Interviews Dashboard</NavLink>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )}
        </ul>
    )
}
