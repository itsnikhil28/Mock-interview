import { useAuth, UserButton } from "@clerk/clerk-react"
import { Loader } from "lucide-react"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"

export default function ProfileContainer() {
    const { isLoaded, isSignedIn } = useAuth()

    if (!isLoaded) {
        return (
            <div className="flex items-center">
                <Loader className="min-w-4 min-h-4 animate-spin text-emerald-500" />
            </div>
        )
    }
    return (
        <div className="flex items-center gap-6">
            {isSignedIn ? (<UserButton afterSignOutUrl="/" />) : (
                <Link to={'/sign-up'}>
                    <Button size={"sm"} className="cursor-pointer">Get Started</Button>
                </Link>
            )}
        </div>
    )
}
