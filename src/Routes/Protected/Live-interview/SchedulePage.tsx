import InterviewScheduleUI from "@/components/InterviewScheduleUI"
import { useUser } from "@/provider/User-Provider"
// import { LoaderIcon } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function SchedulePage() {
    const { role } = useUser()
    const navigate = useNavigate()
    // const [loading, setloading] = useState(false)

    useEffect(() => {
        if (role === "candidate") navigate("/");
    }, [role, navigate]);

    // if (loading) return (
    //     <div className="h-[40vh] md:h-[70vh] flex justify-center items-center">
    //         <LoaderIcon className="w-10 h-10 min-w-10 min-h-10 animate-spin" />
    //     </div>
    // )

    return (
        <InterviewScheduleUI />
    )
}
