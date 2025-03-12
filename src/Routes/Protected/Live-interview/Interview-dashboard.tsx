import Actioncard from "@/components/Action-card";
import Meetingmodal from "@/components/Meeting-modal";
import { useUser } from "@/provider/User-Provider"
import { QUICK_ACTIONS } from "@/lib/helper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Interviewdashboard() {
    const { role } = useUser()
    const isInterviewer = role === 'interviewer';
    const [showModal, setShowModal] = useState(false)
    const [modalType, setmodalType] = useState<"start" | "join">()
    const navigate = useNavigate()


    const handleQuickAction = (title: string) => {
        switch (title) {
            case "New Call":
                setmodalType('start')
                setShowModal(true)
                break;

            case "Join Interview":
                setmodalType('join')
                setShowModal(true)
                break;

            default:
                navigate(`/interviewer/${title.toLowerCase()}`)
                break;
        }
    }

    return (
        <div className="container max-w-7xl mx-auto p-6">
            {/* WELCOME SECTION */}
            <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    Welcome back!
                </h1>
                <p className="text-muted-foreground mt-2">
                    {isInterviewer
                        ? "Manage your interviews and review candidates effectively"
                        : "Access your upcoming interviews and preparations"}
                </p>
            </div>

            {isInterviewer ? (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {QUICK_ACTIONS.map((action, index) => (
                            <Actioncard
                                key={index}
                                action={action}
                                onClick={() => handleQuickAction(action.title)}
                            />
                        ))}
                    </div>

                    <Meetingmodal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
                        isJoinMeeting={modalType === "join"}
                    />
                </>
            ) : (
                <>
                    <div>
                        <h1 className="text-3xl font-bold">Your Interviews</h1>
                        <p className="text-muted-foreground mt-1">View and join your scheduled interviews</p>
                    </div>

                    {/* <div className="mt-8">
                        {interviews === undefined ? (
                            <div className="flex justify-center py-12">
                                <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : interviews.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {interviews.map((interview) => (
                                    // <MeetingCard key={interview._id} interview={interview} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                You have no scheduled interviews at the moment
                            </div>
                        )}
                    </div> */}
                </>
            )}
        </div>
    )
}
