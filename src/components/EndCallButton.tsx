import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore"
import { db } from "@/config/firebase.config"
import { useEffect, useState } from "react"
import { LiveInterview } from "@/types"

export default function EndCallButton() {
    const call = useCall();
    const navigate = useNavigate();
    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant();

    const [liveInterviewDoc, setLiveInterviewDoc] = useState<LiveInterview | null>(null);
    const [isMeetingOwner, setIsMeetingOwner] = useState<boolean>(false);

    useEffect(() => {
        if (!call || !localParticipant) return;
        setIsMeetingOwner(localParticipant?.userId === call.state.createdBy?.id);
    }, [call, localParticipant]);

    useEffect(() => {
        if (!call) return;

        const getdata = async () => {
            try {
                const q = query(collection(db, "liveinterviews"), where("streamCallId", "==", call.id));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data() as LiveInterview;
                    setLiveInterviewDoc({ ...docData, id: querySnapshot.docs[0].id });
                } else {
                    console.error("No matching document found.");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        };

        getdata();
    }, [call]);

    const endcall = async () => {
        try {
            if (call) {
                await call.endCall();
            }

            if (!liveInterviewDoc) return toast.error("Something Went Wrong");

            await updateDoc(doc(db, "liveinterviews", liveInterviewDoc.id), {
                status: "completed",
                updated_at: serverTimestamp(),
            });

            navigate("/");
            toast.success("Meeting Ended for everyone");
        } catch (error) {
            console.log(error);
            toast.error("Network Issue... Failed to end meeting");
        }
    };

    if (!call || !isMeetingOwner) return null; // Only conditionally render the UI, but hooks are already called

    return <Button variant="destructive" onClick={endcall}>End Call</Button>;
}

