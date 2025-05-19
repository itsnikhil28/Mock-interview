import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { useStreamVideoClient } from "@stream-io/video-react-sdk"
import { toast } from "sonner"
import { Loader2, XIcon } from "lucide-react"
import CandidateRequestForm from "./Candidate-request-from"
import { useUser } from "@clerk/clerk-react";
import { useUser as userRole } from "@/provider/User-Provider";
import { addDoc, arrayUnion, collection, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore"
import { db } from "@/config/firebase.config"
import { User } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import UserInfo from "./UserInfo"

interface Meetingmodalprops {
    isOpen: boolean
    onClose: () => void
    title: string
    isJoinMeeting: boolean
    interviewrequest: boolean
}

export default function Meetingmodal({ isOpen, onClose, title, isJoinMeeting, interviewrequest }: Meetingmodalprops) {
    const [meetingUrl, setmeetingUrl] = useState("")
    const [meetingid, setmeetingid] = useState("")
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([])
    const navigate = useNavigate()
    const client = useStreamVideoClient()
    const { user } = useUser()
    const { role } = userRole();
    const [invitemodal, setinvitemodal] = useState(false)
    const [formData, setFormData] = useState({
        membersid: user?.id ? [user.id] : [],
    });

    const addmember = (memberid: string) => {
        if (!formData.membersid.includes(memberid)) {
            setFormData((prev) => ({
                ...prev,
                membersid: [...prev.membersid, memberid],
            }));
        }
    };

    const removemember = (memberid: string) => {
        setFormData((prev) => ({
            ...prev,
            membersid: prev.membersid.filter((id) => id !== memberid),
        }));
    };

    const selectedmember = users.filter((i) =>
        formData.membersid.includes(i.id)
    );

    // Get all users
    const getallusers = async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, "users"));
            const usersList = usersSnapshot.docs.map(doc => ((doc.data() as User))).filter(userData => userData.id !== user?.id);;
            setUsers(usersList);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

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

            await addDoc(collection(db, "liveinterviews"), {
                title: "Instant Meeting",
                description: "Instant Meeting",
                interviewerId: [user?.id],
                startTime: new Date().getTime(),
                status: "upcoming",
                streamCallId: id,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });

            setinvitemodal(true)
            getallusers()
            setmeetingid(call.id)

            toast.success("Meeting Created")
        } catch (error) {
            console.error(error)
            toast.error("Failed to create Meeting")
        } finally {
            setLoading(false);
        }
    }

    const sendemail = async () => {
        setLoading(true)

        const interviewsSnapshot = await getDocs(query(collection(db, "liveinterviews"), where("streamCallId", "==", meetingid)));

        if (!interviewsSnapshot.empty) {
            const interviewDoc = interviewsSnapshot.docs[0];
            const docRef = interviewDoc.ref;

            await updateDoc(docRef, { userId: selectedmember[0]['id'], updated_at: serverTimestamp() })
        } else {
            console.log(`No document found with streamCallId: ${meetingid}`);
        }

        if (!meetingid.trim()) {
            toast.error("MeetingId is missing");
            return;
        }

        const recipients = selectedmember.map(member => ({
            name: member.name,
            email: member.email
        }));

        const payload = {
            recipients: recipients,
            meetingId: meetingid,
            meetingUrl: `${import.meta.env.VITE_MAIN_WEBSITE_URL}/meeting/${meetingid}`,
        };

        try {
            fetch(`${import.meta.env.VITE_API_URL}/api/send-invite-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        navigate(`/meeting/${meetingid}`)
                        toast.success(res.message);
                    } else {
                        toast.error(res.message);
                    }
                })
                .catch(err => {
                    console.error("Error sending email:", err);
                    toast.error("Something went wrong when sending mail.");
                })
                .finally(() => {
                    setLoading(false)
                    setmeetingid("")
                });
        } catch (error) {
            toast.error("Something went wrong when sending mail..")
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
        if (!client) return toast.error("Failed to join Meeting.. Please try again...");
        setLoading(true)

        if (!user) {
            toast.error("User not authenticated");
            return;
        }

        const call = await getcall(callid);

        if (!call) {
            toast.error("Meeting not found");
            setLoading(false)
            return;
        }

        const response = await call.queryMembers({});
        const members = response.members || [];

        const currentuserincall = members.find(member => member.user_id === user?.id);

        if (currentuserincall) {
            toast.info("You are already in the meeting. Navigating to meeting...");
            navigate(`/meeting/${callid}`);
            setLoading(false);
            return;
        }

        const candidateCount = members.filter(member => member.role === "candidate").length;

        const isInterviewer = role === "interviewer";

        if (!isInterviewer && candidateCount >= 1) {
            toast.error("Only one candidate can join the meeting.");
            setLoading(false);
            return;
        }

        await call.updateCallMembers({
            update_members: [{ user_id: user.id, role: isInterviewer ? "interviewer" : "candidate" }],
        });

        const interviewsSnapshot = await getDocs(query(collection(db, "liveinterviews"), where("streamCallId", "==", callid)));

        if (!interviewsSnapshot.empty) {
            const interviewDoc = interviewsSnapshot.docs[0];
            const docRef = interviewDoc.ref;

            const interviewData = interviewDoc.data();

            const currentTime = Date.now();
            const startTime = interviewData.startTime;

            if (currentTime < startTime) {
                const formattedTime = new Date(startTime).toLocaleString();
                navigate('/');
                toast.error(`This meeting has not started yet. It will start at ${formattedTime}.`);
                return;
            }

            if (role === "candidate") {
                await updateDoc(docRef, { userId: user.id, updated_at: serverTimestamp() });
            } else if (role === "interviewer") {
                await updateDoc(docRef, { interviewerId: arrayUnion(user.id), updated_at: serverTimestamp() });
            }
        } else {
            console.log(`No document found with streamCallId: ${callid}`);
        }

        toast.success("Joined the meeting successfully");

        navigate(`/meeting/${callid}`);
        setLoading(false);
    };

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
        <>
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

            {invitemodal && (
                <Dialog open={invitemodal} onOpenChange={() => setinvitemodal(false)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite Member To Meeting</DialogTitle>
                            <DialogDescription>
                                {null}
                            </DialogDescription>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Members</label>
                                    <div className="flex flex-wrap gap-2 my-2">
                                        {selectedmember.map((member) => (
                                            <div
                                                key={member.id}
                                                className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                                            >
                                                <UserInfo user={member} />
                                                {member.id !== user?.id && (
                                                    <button
                                                        onClick={() => removemember(member.id)}
                                                        className="hover:text-destructive transition-colors"
                                                    >
                                                        <XIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {users.length > 0 && (
                                        <Select onValueChange={addmember}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Add Members" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((item, index) => (
                                                    <SelectItem key={index} value={`${item.id}`}>
                                                        <UserInfo user={item} />
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button variant={"outline"} onClick={() => setinvitemodal(false)}>Cancel</Button>
                                    <Button onClick={sendemail} disabled={loading}>
                                        {loading ? (<Loader2 className="animate-spin h-5 w-5" />) : "Send Invite"}
                                    </Button>
                                </div>
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
