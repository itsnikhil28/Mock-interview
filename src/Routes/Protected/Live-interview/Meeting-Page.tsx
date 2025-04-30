import MeetingRoom from '@/components/MeetingRoom'
import MeetingSetup from '@/components/MeetingSetup'
import { db } from '@/config/firebase.config'
import { Call, StreamCall, StreamTheme, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { LoaderIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

export default function MeetingPage() {
    const { meetingId } = useParams()
    const [call, setcall] = useState<Call>()
    const [iscallloading, setiscallloading] = useState(false)
    const client = useStreamVideoClient()
    const [isSetupComplete, setisSetupComplete] = useState(false)
    const navigate = useNavigate()
    const [meetingData, setMeetingData] = useState<any>(null)

    const checkMeetingStatus = async (meetingId: string) => {
        try {
            const q = query(collection(db, "liveinterviews"), where("streamCallId", "==", meetingId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const meetingData = querySnapshot.docs[0].data();
                setMeetingData(meetingData);

                const currentTime = Date.now();
                const startTime = meetingData.startTime;

                if (meetingData.status === "completed") {
                    navigate('/');
                    toast.error("This meeting has ended.");
                    return;
                }

                if (currentTime < startTime) {
                    const formattedTime = new Date(startTime).toLocaleString();
                    navigate('/');
                    toast.error(`This meeting has not started yet. It will start at ${formattedTime}.`);
                    return;
                }
            }

        } catch (error) {
            console.error("Error checking meeting status:", error);
            toast.error("Failed to check meeting status.");
        }
    }

    useEffect(() => {
        if (meetingId) {
            checkMeetingStatus(meetingId)
        }
    }, [meetingId])


    useEffect(() => {
        if (!client) return;

        const getcall = async () => {
            setiscallloading(true);
            try {
                const { calls } = await client.queryCalls({ filter_conditions: { id: meetingId } });

                if (calls.length > 0) {
                    const callInstance = calls[0];

                    setcall(callInstance);
                }
            } catch (error) {
                console.log(error);
                setcall(undefined);
            } finally {
                setiscallloading(false);
            }
        };

        getcall();
    }, [client, meetingId]);

    if (iscallloading) return (
        <div className="h-[40vh] md:h-[70vh] flex justify-center items-center">
            <LoaderIcon className="w-10 h-10 min-w-10 min-h-10 animate-spin" />
        </div>
    )

    if (!call) {
        return (
            <div className="h-[40vh] md:h-[70vh] flex justify-center items-center">
                <p className='font-semibold text-3xl '>Meeting not found</p>
            </div>
        )
    }
    return (
        <StreamCall call={call}>
            <StreamTheme>
                {!isSetupComplete ? (
                    <MeetingSetup onSetupComplete={() => setisSetupComplete(true)} />
                ) : (
                    <MeetingRoom meetingData={meetingData} />
                )}
            </StreamTheme>
        </StreamCall>
    )
}
