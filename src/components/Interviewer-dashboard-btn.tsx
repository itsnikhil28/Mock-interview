import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { SparklesIcon } from 'lucide-react'

export default function Interviewerdashboardbtn() {
    return (
        <Link to={"/interviewer/dashboard"}>
            <Button className="gap-2 font-medium" size={"sm"}>
                <SparklesIcon className="size-4" />
                Dashboard
            </Button>
        </Link>
    )
}
