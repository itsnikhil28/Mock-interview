import Custombreadcrumb from "@/components/Custom-breadcrumb";
import MeetingCard from "@/components/Meeting-Card";
import { db } from "@/config/firebase.config";
import { LiveInterview } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export default function CandidateScheduledInterview() {
    const { userId } = useAuth()
    const [interviews, setinterviews] = useState<LiveInterview[]>([])
    const [loading, setloading] = useState(false)

    //get all interviewers
    const getallinterviews = async () => {
        setloading(true);
        try {
            const snapshot = await getDocs(query(collection(db, "liveinterviews"), where("userId", "==", userId)));
            const interviewers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as LiveInterview);
            setinterviews(interviewers);
            console.log(interviewers)
        } catch (error) {
            console.error("Error fetching interviews:", error);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        getallinterviews()
    }, [])

    return (
        <div>

            <Custombreadcrumb breadCrumpPage={"Scheduled Interview"} breadCrumpItems={[{ label: "Dashboard", link: '/candidate-dashboard' }]} />


            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center items-center h-[400px]">
                        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : interviews.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {interviews.map((interview, index) => (
                            <MeetingCard key={index} liveinterview={interview} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                        <p className="text-xl font-medium text-muted-foreground text-center"> You have no scheduled interviews at the moment</p>
                    </div>
                )}
            </div>
        </div>
    )
}
