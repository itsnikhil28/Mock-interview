import { db } from "@/config/firebase.config"
import { LiveInterview, RequestedInterview, User } from "@/types"
import { useUser } from "@clerk/clerk-react"
import { useStreamVideoClient } from "@stream-io/video-react-sdk"
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Loader2Icon, XIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import UserInfo from "./UserInfo"
import { Separator } from "./ui/separator"
import { Calendar } from "./ui/calendar"
import { TIME_SLOTS } from "@/lib/helper"
import MeetingCard from "./Meeting-Card"
import Custombreadcrumb from "./Custom-breadcrumb"

export default function InterviewScheduleUI() {
    const client = useStreamVideoClient()
    const { user } = useUser()
    const [open, setopen] = useState(false)
    const [loading, setloading] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [liveInterviewsMap, setLiveInterviewsMap] = useState<{ [key: string]: LiveInterview[] }>({});
    const [requestedinterviews, setrequestedinterviews] = useState<RequestedInterview[]>([])
    const [viewMeetingsMap, setViewMeetingsMap] = useState<{ [key: string]: boolean }>({});
    const [loadingInterviewsMap, setLoadingInterviewsMap] = useState<{ [key: string]: boolean }>({});
    const [LoadingInterviews, setLoadingInterviews] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        userId: "",
        interviewerIds: user?.id ? [user.id] : [],
    });

    // Get all users
    const getallusers = async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, "users"));
            const usersList = usersSnapshot.docs.map(doc => ((doc.data() as User)));
            setUsers(usersList);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


    //  Get all live interviews
    const getallinterviews = async (userId: string) => {
        setLoadingInterviewsMap(prev => ({ ...prev, [userId]: true }));

        try {
            const snapshot = await getDocs(
                query(collection(db, "liveinterviews"), where("userId", "==", userId), where("interviewerId", "array-contains", user?.id))
            );
            const interviews = snapshot.docs.map(doc => (doc.data() as LiveInterview));

            setLiveInterviewsMap(prev => ({ ...prev, [userId]: interviews }));
            setViewMeetingsMap(prev => ({ ...prev, [userId]: !prev[userId] }));
        } catch (error) {
            console.error("Error fetching interviews:", error);
        } finally {
            setLoadingInterviewsMap(prev => ({ ...prev, [userId]: false }));
        }
    };

    // get requested interviews
    const getrequestinterviews = async () => {
        setLoadingInterviews(true);
        try {
            const snapshot = await getDocs(query(collection(db, "requestedinterviews"), where("interviewerId", "==", user?.id)));
            const interviews = snapshot.docs.map(doc => (doc.data() as RequestedInterview));
            setrequestedinterviews(interviews);
        } catch (error) {
            console.error("Error fetching interviews:", error);
        } finally {
            setLoadingInterviews(false);
        }
    };

    // scheduled email
    const sendscheduledemail = (startTime: number, meetingId: string, userId: string) => {
        toast.success("Meeting scheduled! Sending email for next steps and tips.")

        if (!meetingId.trim()) {
            toast.error("MeetingId is missing");
            return;
        }

        const user = users.filter((u) => u.id === userId)[0]

        const interviewers = selectedInterviewers.map(member => ({
            name: member.name,
            email: member.email
        }));

        const payload = {
            title: formData.title,
            description: formData.description,
            startTime: startTime,
            user: user,
            meetingUrl: `${import.meta.env.VITE_MAIN_WEBSITE_URL}/meeting/${meetingId}`,
            interviewers: interviewers,
        };

        try {
            fetch(`${import.meta.env.VITE_API_URL}/api/send-scheduled-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        toast.success(res.message);
                    } else {
                        toast.error(res.message);
                    }
                })
                .catch(err => {
                    console.error("Error sending email:", err);
                    toast.error("Something went wrong when sending mail.");
                })
        } catch (error) {
            toast.error("Something went wrong when sending mail..")
        }
    }

    // Function to create a new live interview
    const createLiveInterview = async () => {
        setloading(true)
        if (!client || !user) return

        if (!formData.userId || formData.interviewerIds.length === 0) {
            toast.error("Please select both candidate and at least one interviewer");
            setloading(false)
            return;
        }

        if (Object.values(formData).some(value => value === "" || value === null || value === undefined)) {
            toast.error("Fill all fields");
            setloading(false)
            return;
        }

        const { title, description, date, time, userId, interviewerIds } = formData;
        const [hours, minutes] = time.split(":");
        const meetingDate = new Date(date);
        meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

        const id = crypto.randomUUID()
        const call = client.call("default", id)

        await call.getOrCreate({
            data: {
                starts_at: meetingDate.toISOString(),
                custom: {
                    description: title,
                    additionalDetails: description,
                }
            }
        })

        try {
            await addDoc(collection(db, "liveinterviews"), {
                title,
                description,
                interviewerId: interviewerIds,
                userId: userId,
                startTime: meetingDate.getTime(),
                status: "upcoming",
                streamCallId: id,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });

            toast.success("Meeting scheduled Successfully")
            setopen(false)

            sendscheduledemail(meetingDate.getTime(), id, userId)

            setFormData((prev) => ({
                ...prev,
                title: "",
                description: "",
                userId: "",
            }));
        } catch (error) {
            console.error("Error creating live interview:", error);
            toast.error("Failed to schedule meeting... Try again later")
        }
        finally {
            setloading(false)
            getallinterviews(userId)
        }
    };

    const addinterviewer = (interviewerId: string) => {
        if (!formData.interviewerIds.includes(interviewerId)) {
            setFormData((prev) => ({
                ...prev,
                interviewerIds: [...prev.interviewerIds, interviewerId],
            }));
        }
    };

    const removeinterviewer = (interviewerId: string) => {
        if (interviewerId === user?.id) return;
        setFormData((prev) => ({
            ...prev,
            interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
        }));
    };

    const candidates = users.filter((u) => u.role === "candidate" && requestedinterviews.some((interview) => interview.userId === u.id));
    const interviewers = users.filter((u) => u.role === "interviewer")

    const selectedInterviewers = interviewers.filter((i) =>
        formData.interviewerIds.includes(i.id)
    );

    const availableInterviewers = interviewers.filter(
        (i) => !formData.interviewerIds.includes(i.id)
    );

    useEffect(() => {
        getallusers()
        getrequestinterviews()
    }, [user, client])

    const viewResume = (resumeId: string) => {
        if (resumeId.startsWith("https://res.cloudinary.com/")) {
            window.open(resumeId, "_blank");
        } else {
            const resumeUrl = `/resume/${resumeId}/view`;
            window.open(resumeUrl, "_blank");
        }
    };

    return (
        <>
            <div className="container max-w-7xl mx-auto p-6 space-y-8">
                <Custombreadcrumb breadCrumpPage={"Schedule"} breadCrumpItems={[{ label: "Dashboard", link: '/interviewer/dashboard' }]} />

                <div className="flex items-center justify-between">
                    {/* Header info  */}

                    <div>
                        <h1 className="text-3xl font-bold">Interviews</h1>
                        <p className="text-muted-foreground mt-1"> Schedule and Manage interviews</p>
                    </div>

                    <Dialog open={open} onOpenChange={setopen}>
                        <DialogTrigger asChild>
                            <Button size={"lg"}>Schedule Interview</Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto">
                            <DialogHeader>
                                <DialogTitle>Schedule Interview</DialogTitle>
                            </DialogHeader>
                            <DialogDescription></DialogDescription>

                            <Separator className="my-1" />

                            <div className="space-y-4 px-3">
                                {/* INTERVIEW TITLE */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title</label>
                                    <Input
                                        placeholder="Interview title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                {/* INTERVIEW DESC */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <Textarea
                                        placeholder="Interview description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                {/* CANDIDATE */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Candidate</label>
                                    <Select
                                        value={formData.userId}
                                        onValueChange={(userId) => setFormData({ ...formData, userId })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select candidate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {candidates.map((candidate) => (
                                                <SelectItem key={candidate.id} value={candidate.id}>
                                                    <UserInfo user={candidate} />
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* INTERVIEWERS */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Interviewers</label>
                                    <div className="flex flex-wrap gap-2 my-2">
                                        {selectedInterviewers.map((interviewer) => (
                                            <div
                                                key={interviewer.id}
                                                className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                                            >
                                                <UserInfo user={interviewer} />
                                                {interviewer.id !== user?.id && (
                                                    <button
                                                        onClick={() => removeinterviewer(interviewer.id)}
                                                        className="hover:text-destructive transition-colors"
                                                    >
                                                        <XIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {availableInterviewers.length > 0 && (
                                        <Select onValueChange={addinterviewer}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Add interviewer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableInterviewers.map((interviewer) => (
                                                    <SelectItem key={interviewer.id} value={interviewer.id}>
                                                        <UserInfo user={interviewer} />
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                {/* DATE & TIME */}
                                <div className="flex gap-4">
                                    {/* CALENDAR */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Date</label>
                                        <Calendar
                                            mode="single"
                                            selected={formData.date}
                                            onSelect={(date) => date && setFormData({ ...formData, date })}
                                            disabled={(date) => date < new Date()}
                                            className="rounded-md border"
                                        />
                                    </div>

                                    {/* TIME */}

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Time</label>
                                        <Select
                                            value={formData.time}
                                            onValueChange={(time) => setFormData({ ...formData, time })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TIME_SLOTS.map((time) => (
                                                    <SelectItem key={time} value={time}>
                                                        {time}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setopen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={createLiveInterview} disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2Icon className="mr-2 size-4 animate-spin" />
                                                Scheduling...
                                            </>
                                        ) : (
                                            "Schedule Interview"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {LoadingInterviews ? (
                    <div className="h-[30vh] md:h-[50vh] flex justify-center items-center">
                        <Loader2Icon className="animate-spin w-8 h-8 text-gray-500" />
                    </div>
                ) : requestedinterviews.length === 0 ? (
                    <div className="h-[30vh] md:h-[50vh] flex justify-center items-center">
                        <p className="text-gray-500 text-sm">No one has requested yet</p>
                    </div>
                ) : null}


                {requestedinterviews && requestedinterviews.map((item, index) => (
                    <div className="border p-4 rounded-lg shadow-md bg-white" key={index}>
                        <div className="p-1">
                            <h3 className="text-lg font-bold">{item.userName}</h3>
                            <p className="text-sm text-gray-600">Email: {item.userEmail}</p>
                        </div>

                        <div className="mt-4 flex justify-end gap-5">
                            <Button onClick={() => getallinterviews(item.userId)}>
                                {loadingInterviewsMap[item.userId] ? (
                                    <Loader2Icon className="animate-spin w-6 h-6 text-gray-500" />
                                ) : viewMeetingsMap[item.userId] ? "Hide Meetings" : "View Meetings"}
                            </Button>
                            <Button variant="outline" onClick={() => viewResume(item.resume)}>View Resume</Button>
                        </div>

                        {/* Show meetings only for the selected user */}
                        {viewMeetingsMap[item.userId] && (
                            loadingInterviewsMap[item.userId] ? (
                                <div className="flex justify-center items-center h-70 py-12">
                                    <Loader2Icon className="animate-spin w-6 h-6 text-gray-500" />
                                </div>
                            ) : liveInterviewsMap[item.userId] && liveInterviewsMap[item.userId].length > 0 ? (
                                <div className="space-y-4 py-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {liveInterviewsMap[item.userId].map((meeting, index) => (
                                            <MeetingCard key={index} liveinterview={meeting} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">No interviews scheduled</div>
                            )
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}
