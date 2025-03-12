import { getMeetingStatus } from "@/lib/utils"
import { LiveInterview } from "@/types"
import { useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { CalendarIcon } from "lucide-react"
import { Badge } from "./ui/badge"

interface MeetingCardProps {
    liveinterview: LiveInterview
}
export default function MeetingCard({ liveinterview }: MeetingCardProps) {
    const client = useStreamVideoClient()
    const navigate = useNavigate()

    const joinMeeting = async (callid: string) => {
        if (!client) return toast.error("Failed to join Meeting.. Please try again...")
        navigate(`/meeting/${callid}`)
    }

    const status = getMeetingStatus(liveinterview)
    const date = new Date(liveinterview.startTime)
    const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: true };
    const formattedDate = date.toLocaleString("en-US", options)


    return (
        <Card>
            <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        {formattedDate}
                    </div>

                    <Badge
                        variant={
                            status === "live" ? "default" : status === "upcoming" ? "secondary" : "outline"
                        }
                    >
                        {status === "live" ? "Live Now" : status === "upcoming" ? "Upcoming" : "Completed"}
                    </Badge>
                </div>
                <CardTitle>{liveinterview.title}</CardTitle>
                {liveinterview.description && (
                    <CardDescription className="line-clamp-2">{liveinterview.description}</CardDescription>
                )}
            </CardHeader>

            <CardContent>
                {status === "live" && (
                    <Button className="w-full" onClick={() => joinMeeting(liveinterview.streamCallId)}>
                        Join Meeting
                    </Button>
                )}

                {status === "upcoming" && (
                    <Button variant="outline" className="w-full" disabled>
                        Waiting to Start
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
