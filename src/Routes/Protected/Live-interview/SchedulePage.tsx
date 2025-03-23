import InterviewScheduleUI from "@/components/InterviewScheduleUI"
import { useUser } from "@/provider/User-Provider"
// import { LoaderIcon } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function SchedulePage() {
    const { role } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (role === "candidate") navigate("/");
    }, [role, navigate]);

    return (
        <InterviewScheduleUI />
    )
}
