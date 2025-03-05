import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoaderPage from "../Loader/Loader";
import Custombreadcrumb from "@/components/Custom-breadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import QuestionSection from "@/components/Question-form";

export default function Mockinterviewpage() {
    const { interviewId } = useParams<{ interviewId: string }>();
    const [interview, setinterview] = useState<Interview | null>(null);
    const [isloading, setisloading] = useState(true);
    // const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!interviewId) {
            navigate("/generate", { replace: true });
        }
    }, [interviewId, navigate]);

    useEffect(() => {
        if (interview === null && !isloading) {
            navigate("/generate", { replace: true });
        }
    }, [interview, isloading, navigate]);

    const fetchinterview = async () => {
        if (interviewId) {
            try {
                const interviewdoc = await getDoc(doc(db, "interviews", interviewId));

                if (interviewdoc.exists()) {
                    setinterview({ id: interviewdoc.id, ...interviewdoc.data() } as Interview);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setisloading(false);
            }
        } else {
            setisloading(false);
        }
    }

    useEffect(() => {
        fetchinterview();
    }, [interviewId]);

    if (isloading) {
        return <LoaderPage className="w-full h-[78vh]" />;
    }
    return (
        <div className="flex flex-col w-full gap-8 py-5">
            <Custombreadcrumb
                breadCrumpPage="Start"
                breadCrumpItems={[
                    { label: 'Mock Interviews', link: '/generate' },
                    { label: interview?.position || "", link: `/generate/interview/${interview?.id}` }]}
            />

            <div className="w-full">
                <Alert className="bg-sky-100/50 border-sky-200 p-4 rounded-lg flex items-start gap-3 -mt-3">
                    <Lightbulb className="h-5 w-5 text-sky-600" />
                    <div>
                        <AlertTitle className="text-sky-800 font-semibold">
                            Important Information
                        </AlertTitle>
                        <AlertDescription className="text-sm text-sky-700 mt-1">
                            Please enable your webcam and microphone to start the AI-generated
                            mock interview. The interview consists of five questions. You’ll
                            receive a personalized report based on your responses at the end.{" "}
                            <br />
                            <br />
                            <span className="font-medium">Note: Your video is <strong>never recorded</strong>. You can disable your webcam at any time.</span>
                        </AlertDescription>
                    </div>
                </Alert>
            </div>

            {interview?.questions && interview?.questions.length > 0 && (
                <div className="mt-4 w-full flex flex-col items-start gap-4">
                    <QuestionSection questions={interview?.questions} />
                </div>
            )}
        </div>
    )
}
