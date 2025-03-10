import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { Interview, Useranswer } from "@/types";
import { toast } from "sonner";
import LoaderPage from "../Loader/Loader";
import Custombreadcrumb from "@/components/Custom-breadcrumb";
import GenerateHeadings from "@/components/Generate-headings";
import InterviewData from "@/components/InterviewData";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { CircleCheck, Star } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function Feedback() {
    const [interview, setInterview] = useState<Interview | null>(null);
    const [feedback, setFeedback] = useState<Useranswer[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFeed, setActiveFeed] = useState("");

    const { userId } = useAuth();
    const { interviewId } = useParams<{ interviewId: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (!interviewId) {
            navigate("/generate", { replace: true });
            return;
        }
        
        const fetchInterviewData = async () => {
            try {
                const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
                if (interviewDoc.exists()) {
                    setInterview({ id: interviewDoc.id, ...interviewDoc.data() } as Interview);
                }
            } catch (error) {
                toast.error("Failed to fetch interview details.");
            }
        };

        const fetchFeedbacks = async () => {
            try {
                const querySnap = await getDocs(
                    query(collection(db, "userAnswers"), where("userId", "==", userId), where("mockIdRef", "==", interviewId))
                );
                
                setFeedback(querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Useranswer)));
            } catch (error) {
                toast.error("Failed to fetch feedbacks. Try again later.");
            }
        };

        Promise.all([fetchInterviewData(), fetchFeedbacks()]).finally(() => setLoading(false));
    }, [interviewId, navigate, userId]);

    const overallRating = useMemo(() => {
        if (feedback.length === 0) return "0.0";
        const totalRatings = feedback.reduce((acc, feed) => acc + feed.rating, 0);
        return (totalRatings / feedback.length).toFixed(1);
    }, [feedback]);

    if (loading) return <LoaderPage className="w-full h-[70vh]" />;

    return (
        <div className="flex flex-col w-full gap-8 py-5">
            <Custombreadcrumb breadCrumpPage="Feedback" breadCrumpItems={[
                { label: "Mock Interviews", link: "/generate" },
                { label: interview?.position || "Interview", link: `/generate/interview/${interview?.id}` }
            ]} />

            <GenerateHeadings title="Congratulations!" description="Your personalized feedback is now available. Discover your strengths, areas for improvement, and key tips to excel in your next interview." />

            <p className="text-base text-muted-foreground">
                Your overall interview rating: <span className="text-emerald-500 font-semibold text-xl">{overallRating} / 10</span>
            </p>

            {interview && <InterviewData interview={interview} onmockpage />}

            <GenerateHeadings title="Interview Feedback" issubheading />

            <Accordion type="single" collapsible className="space-y-6">
                {feedback.map(feed => (
                    <AccordionItem key={feed.id} value={feed.id} className="border rounded-lg shadow-md">
                        <AccordionTrigger onClick={() => setActiveFeed(feed.id)}
                            className={cn("px-5 py-3 flex items-center justify-between text-base rounded-t-lg transition-colors hover:no-underline cursor-pointer",
                                activeFeed === feed.id ? "bg-gradient-to-r from-purple-50 to-blue-50" : "hover:bg-gray-50")}
                        >
                            {feed.question}
                        </AccordionTrigger>

                        <AccordionContent className="px-5 py-6 bg-white rounded-b-lg space-y-5 shadow-inner">
                            <div className="text-lg font-semibold text-gray-700">
                                <Star className="inline mr-2 text-yellow-400" />
                                Rating: {feed.rating}
                            </div>

                            {[{
                                title: "Expected Answer",
                                text: feed.correct_ans,
                                bg: "bg-green-50",
                                iconColor: "text-green-600"
                            }, {
                                title: "Your Answer",
                                text: feed.user_ans,
                                bg: "bg-yellow-50",
                                iconColor: "text-yellow-600"
                            }, {
                                title: "Feedback",
                                text: feed.feedback,
                                bg: "bg-red-50",
                                iconColor: "text-red-600"
                            }].map(({ title, text, bg, iconColor }) => (
                                <Card key={title} className={`border-none space-y-3 p-4 ${bg} rounded-lg shadow-md`}>
                                    <CardTitle className="flex items-center text-lg">
                                        <CircleCheck className={`mr-2 ${iconColor}`} />
                                        {title}
                                    </CardTitle>
                                    <CardDescription className="font-medium text-gray-700">
                                        {text}
                                    </CardDescription>
                                </Card>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
