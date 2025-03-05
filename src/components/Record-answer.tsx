import { useAuth } from '@clerk/clerk-react';
import { CircleStop, Loader, Mic, RefreshCw, Save, Video, VideoOff, WebcamIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import useSpeechToText, { ResultType } from 'react-hook-speech-to-text';
import { useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import TooltipButton from './tooltip-button';
import { toast } from 'sonner';
import { chatSession } from '@/scripts';
import { cleanAiResponse } from './clean-airesponse';
import { SaveModal } from './save-modal';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '@/config/firebase.config';

interface RecordAnswerProps {
    question: { question: string; answer: string }
    iswebcam: boolean
    setiswebcam: (values: boolean) => void
}

interface AIResponse {
    ratings: number
    feedback: string
}

export default function RecordAnswer({ question, iswebcam, setiswebcam }: RecordAnswerProps) {
    const { interimResult, isRecording, results, startSpeechToText, stopSpeechToText } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    const [fetchanswer, setfetchanswer] = useState("")
    const [useranswer, setuseranswer] = useState("")
    const [isaigenerating, setisaigenerating] = useState(false)
    const [airesult, setairesult] = useState<AIResponse | null>(null)
    const [open, setopen] = useState(false)
    const [loading, setloading] = useState(false)

    const { userId } = useAuth()
    const { interviewId } = useParams()

    const recorduseranswer = async () => {
        if (isRecording) {
            stopSpeechToText();

            if (useranswer?.length < 50) {
                toast.error("Error", { description: "Your answer should be more than 50 characters" })

                return
            }

            const airesult = await generateresult(question.question, question.answer, useranswer);

            setairesult(airesult)
        } else {
            startSpeechToText()
        }
    }

    const generateresult = async (qst: string, qstans: string, userans: string): Promise<AIResponse> => {
        setisaigenerating(true)
        const prompt = `
            Question: "${qst}" 
            User Answer: "${userans}"
            Correct Answer: "${qstans}"
            Please compare the user's answer to the correct answer, and provide:
            1. A rating (from 1 to 10) based on answer quality.
            2. Feedback for improvement.

            Return the response **strictly as a JSON array** containing a single object with the following format:
            [
            { "ratings": (number), "feedback": (string) }
            ]

            Ensure the response follows this exact format with no additional text.
            `;

        try {
            const airesult = await chatSession.sendMessage(prompt)

            const rawResult = cleanAiResponse(airesult.response.text());

            // Ensure we get a valid AIResponse object
            const parsedresult: AIResponse =
                Array.isArray(rawResult) && rawResult.length > 0 && typeof rawResult[0] === "object" && "ratings" in rawResult[0] && "feedback" in rawResult[0]
                    ? rawResult[0]  // Use first object from array
                    : { ratings: 0, feedback: "No feedback available" };

            return parsedresult
        } catch (error) {
            console.log(error);
            toast("Error", {
                description: "An error occurred while generating feedback."
            })
            return { ratings: 0, feedback: "Unable to generate feedback" }
        } finally {
            setisaigenerating(false)
        }
    }

    const recordnewanswer = () => {
        setuseranswer('')
        stopSpeechToText()
        startSpeechToText()
    }

    const saveuseranswer = async () => {
        setloading(true)

        if (!airesult) {
            return
        }

        const currentquestion = question.question
        try {
            const useranswerquery = query(
                collection(db, "userAnswers"),
                where("userId", "==", userId),
                where("question", '==', currentquestion)
            )

            const querysnap = await getDocs(useranswerquery)

            if (!querysnap.empty) {
                console.log("Query Snap Size", querysnap.size)
                toast.info("Already Answered", {
                    description: "You have already answered this question"
                })

                return
            } else {
                await addDoc(collection(db, "userAnswers"), {
                    mockIdRef: interviewId,
                    question: question.question,
                    correct_ans: question.answer,
                    user_ans: useranswer,
                    feedback: airesult.feedback,
                    rating: airesult.ratings,
                    userId,
                    created_at: serverTimestamp()
                })

                toast("Saved", { description: "Your answer has been saved.." })
            }

            if(userId){
                fetchUserAnswer(userId, currentquestion)
            }

            setuseranswer("")
            stopSpeechToText()
        } catch (error) {
            toast("Error", {
                description: "An error occurred while generating feedback"
            })
            console.log(error)
        } finally {
            setloading(false)
            setopen(!open)
        }
    }

    const fetchUserAnswer = async (userId: string, question: string) => {
        const q = query(collection(db, "userAnswers"), where("userId", "==", userId), where("question", "==", question));
        const snap = await getDocs(q);
        const useranswer = snap.empty ? "" : snap.docs[0].data().user_ans;
        setfetchanswer(useranswer)
    };

    useEffect(() => {
        if (userId && question) {
            fetchUserAnswer(userId, question.question)
        }
    }, [userId, question]);

    useEffect(() => {
        const combinetranscripts = results.filter((result): result is ResultType => typeof result !== "string").map((result) => result.transcript).join(" ");

        setuseranswer(combinetranscripts)
    }, [results])


    return (
        <div className='w-full flex flex-col items-center gap-8 mt-4'>

            {/* modal  */}
            <SaveModal isopen={open} onclose={() => setopen(false)} onconfirm={saveuseranswer} loading={loading} />

            {!fetchanswer && <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
                {iswebcam ? (
                    <Webcam onUserMedia={() => setiswebcam(true)} onUserMediaError={() => setiswebcam(false)} className="w-full h-full object-cover rounded-md" />
                ) : (
                    <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
                )}
            </div>}

            {!fetchanswer && <div className="flex items-center justify-center gap-3">
                <TooltipButton content={iswebcam ? "Turn Off" : "Turn On"} icon={iswebcam ? (
                    <VideoOff className='min-h-5 min-w-5' />
                ) : (
                    <Video className='min-h-5 min-w-5' />
                )} onClick={() => {setiswebcam(!iswebcam); recorduseranswer()}} />

                <TooltipButton content={isRecording ? "Stop Recording" : "Start Recording"} icon={isRecording ? (
                    <CircleStop className='min-h-5 min-w-5' />
                ) : (
                    <Mic className='min-h-5 min-w-5' />
                )} onClick={recorduseranswer} />

                <TooltipButton content={"Record Again"} icon={<RefreshCw className='min-w-5 min-h-5' />} onClick={recordnewanswer} />

                <TooltipButton content={"Save Result"} icon={isaigenerating ? (
                    <Loader className='min-h-5 min-w-5 animate-spin' />
                ) : (
                    <Save className='min-h-5 min-w-5' />
                )} onClick={() => setopen(!open)} disabled={!airesult} />
            </div>}

            <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
                <h2 className='text-lg font-semibold'>Your Answer:</h2>

                <p className='text-sm mt-2 text-gray-700 whitespace-normal'>
                    {fetchanswer || useranswer || "Start recording to see your answer here"}
                </p>

                {interimResult && (
                    <p className='text-sm mt-2 text-gray-500'>
                        <strong>Current Speech: </strong>{interimResult}
                    </p>
                )}
            </div>
        </div>
    )
}
