import { MainRoutes } from "@/lib/helper"
import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/clerk-react"
import { NavLink } from "react-router-dom"

interface NavigationRoutesProps {
    isMobile?: boolean
}

export default function NavigationRoutes({ isMobile = false }: NavigationRoutesProps) {
    const {userId}=useAuth()
    return (
        <ul className={cn("flex items-center gap-6",isMobile && 'mt-[25px] items-center flex-col gap-8')}>
            {MainRoutes.map((item, i) => (
                <NavLink key={i} to={item.href} className={({isActive}) => cn('text-base text-neutral-600',isActive && 'text-neutral-900 font-semibold')}>{item.label}</NavLink>
            ))}

            {userId && (
                <NavLink to={'/generate'} className={({ isActive }) => cn('text-base text-neutral-600', isActive && 'text-neutral-900 font-semibold')}>Take An Interview</NavLink>
            )}
        </ul>
    )
}
