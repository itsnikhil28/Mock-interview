import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { useStreamVideoClient } from "@stream-io/video-react-sdk"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import CandidateRequestForm from "./Candidate-request-from"
import { useUser } from "@clerk/clerk-react"

interface Meetingmodalprops {
    isOpen: boolean
    onClose: () => void
    title: string
    isJoinMeeting: boolean
    interviewrequest: boolean
}

export default function Meetingmodal({ isOpen, onClose, title, isJoinMeeting, interviewrequest }: Meetingmodalprops) {
    const [meetingUrl, setmeetingUrl] = useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const client = useStreamVideoClient()
    const { user } = useUser()

    const createInstanceMeeting = async () => {
        if (!client) return
        setLoading(true);

        try {
            const id = crypto.randomUUID()
            const call = client.call('default', id)

            await call.getOrCreate({
                data: {
                    starts_at: new Date().toISOString(),
                    custom: {
                        description: "Instant Meeting"
                    }
                }
            })

            navigate(`/meeting/${call.id}`)
            toast.success("Meeting Created")
        } catch (error) {
            console.error(error)
            toast.error("Failed to create Meeting")
        } finally {
            setLoading(false);
        }
    }

    const getcall = async (callid: string) => {
        if (!client) return

        try {
            const { calls } = await client.queryCalls({ filter_conditions: { id: callid } })

            if (calls.length > 0) {
                return (calls[0])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const joinMeeting = async (callid: string) => {
        if (!client) return toast.error("Failed to join Meeting.. Please try again...")

        if (!user) {
            toast.error("User not authenticated");
            return;
        }

        const call = await getcall(callid)

        if (call) {
            console.log("hello")
            await call.updateCallMembers({
                update_members: [{ user_id: user.id, role: "guest" }],
            });
            console.log("hello done")
        }

        setLoading(true)
        navigate(`/meeting/${callid}`)
        setLoading(false)
    }

    const handlestart = () => {
        if (isJoinMeeting) {
            const meetingid = meetingUrl.split('/').pop()

            if (meetingid) {
                joinMeeting(meetingid)
            }
        } else {
            createInstanceMeeting()
        }

        setmeetingUrl("")
        // onClose()
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {null}
                    </DialogDescription>
                    {interviewrequest ? (
                        <div className="space-y-4 pt-4">

                            {/* Form for Interview Request */}
                            <CandidateRequestForm onClose={onClose} />
                        </div>
                    ) : (
                        <div className="space-y-4 pt-4">
                            {isJoinMeeting && (
                                <Input placeholder="Paste Meeting link here..." value={meetingUrl} onChange={(e) => setmeetingUrl(e.target.value)} />
                            )}

                            <div className="flex justify-end gap-3">
                                <Button variant={"outline"} onClick={onClose}>Cancel</Button>
                                <Button onClick={handlestart} disabled={isJoinMeeting && !meetingUrl.trim()}>{loading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : isJoinMeeting ? "Join Meeting" : "Start Meeting"}</Button>
                            </div>
                        </div>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
