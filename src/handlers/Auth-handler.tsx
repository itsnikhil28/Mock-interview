import { db } from "@/config/firebase.config"
import LoaderPage from "@/Routes/Loader/Loader"
import { User } from "@/types"
import { useAuth, useUser } from "@clerk/clerk-react"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

interface AuthHandlerProps {
    children: React.ReactNode
}

export default function AuthHandler({ children }: AuthHandlerProps) {
    const { isSignedIn } = useAuth()
    const { user } = useUser()

    const pathname = useLocation().pathname
    const navigate = useNavigate()

    const [loading, setloading] = useState(false)

    useEffect(() => {
        const storeuserdata = async () => {
            if (isSignedIn && user) {
                setloading(true);
                try {
                    const usersnap = await getDoc(doc(db, "users", user.id))

                    if (!usersnap.exists()) {
                        const userdata: User = {
                            id: user.id,
                            name: user.fullName || user.firstName || 'Anonymous',
                            email: user.primaryEmailAddress?.emailAddress || "N/a",
                            imageUrl: user.imageUrl || 'N/A',
                            role: 'candidate',
                            created_at: serverTimestamp(),
                            updated_at: serverTimestamp()
                        }

                        await setDoc(doc(db, 'users', user.id), userdata)
                    }
                } catch (error) {
                    console.log("Error on storing user data : ", error)
                } finally {
                    setloading(false)
                }
            }
        }

        storeuserdata()
    }, [isSignedIn, user, pathname, navigate])

    if (loading) {
        return <LoaderPage />
    }

    return (
        <>{children}</>
    )
}
