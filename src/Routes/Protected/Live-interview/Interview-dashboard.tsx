import Actioncard from "@/components/Action-card";
import Meetingmodal from "@/components/Meeting-modal";
import { useUser } from "@/provider/User-Provider"
import { QUICK_ACTIONS_FOR_CANDIDATE, QUICK_ACTIONS_FOR_INTERVIEW } from "@/lib/helper";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function Interviewdashboard() {
    const { role } = useUser()
    const isInterviewer = role === 'interviewer';
    const [showModal, setShowModal] = useState(false)
    const [modalType, setmodalType] = useState<"start" | "join" | "request">()
    const navigate = useNavigate()
    const location = useLocation();

    const isOnInterviewerDashboard = location.pathname === "/interviewer/dashboard";

    if (isInterviewer && !isOnInterviewerDashboard) {
        return <Navigate to="/interviewer/dashboard" replace />;
    }
    if (!isInterviewer && isOnInterviewerDashboard) {
        return <Navigate to="/candidate-dashboard" replace />;
    }

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

    const handleQuickActionCandidate = (location: string) => {
        switch (location) {
            case "join-instant-interview":
                setmodalType('join')
                setShowModal(true)
                break;

            case "request-interview":
                setmodalType('request')
                setShowModal(true)
                break;

            default:
                navigate(`/candidate/${location}`)
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
                        {QUICK_ACTIONS_FOR_INTERVIEW.map((action, index) => (
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
                        title={modalType === "request" ? "" : modalType === "join" ? "Join Meeting" : "Start Meeting"}
                        isJoinMeeting={modalType === "join"}
                        interviewrequest={false}
                    />
                </>
            ) : (
                <>
                    <div>
                        <h1 className="text-3xl font-bold">Your Interviews</h1>
                        <p className="text-muted-foreground mt-1">View and join your scheduled interviews</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
                        {QUICK_ACTIONS_FOR_CANDIDATE.map((action, index) => (
                            <Actioncard
                                key={index}
                                action={action}
                                onClick={() => handleQuickActionCandidate(action.location)}
                            />
                        ))}
                    </div>

                    <Meetingmodal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        title={modalType === "request" ? "Request Interview" : modalType === "join" ? "Join Meeting" : "Start Meeting"}
                        isJoinMeeting={modalType === "join"}
                        interviewrequest={modalType === 'request'}
                    />
                </>
            )}
        </div>
    )
}
