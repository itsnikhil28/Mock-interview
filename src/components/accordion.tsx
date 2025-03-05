import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Star, CircleCheck } from "lucide-react";

type Feedback = {
    id: string;
    question: string;
    rating: number;
    correct_ans: string;
    user_ans: string;
    feedback: string;
};

interface Props {
    feedbacks: Feedback[];
    activeFeed: string | null;
    setActiveFeed: (id: string) => void;
}

const FeedbackAccordion: React.FC<Props> = ({ feedbacks, activeFeed, setActiveFeed }) => {
    return (
        <Accordion type="single" collapsible className="space-y-6">
            {feedbacks.map((feed) => (
                <AccordionItem key={feed.id} value={feed.id} className="border rounded-lg shadow-md">
                    <AccordionTrigger
                        onClick={() => setActiveFeed(feed.id)}
                        className={`px-5 py-3 flex items-center justify-between text-base rounded-t-lg transition-colors hover:no-underline ${activeFeed === feed.id ? "bg-gradient-to-r from-purple-50 to-blue-50" : "hover:bg-gray-50"
                            }`}
                    >
                        <span>{feed.question}</span>
                    </AccordionTrigger>

                    <AccordionContent className="px-5 py-6 bg-white rounded-b-lg space-y-5 shadow-inner">
                        <div className="text-lg font-semibold text-gray-700">
                            <Star className="inline mr-2 text-yellow-400" />
                            Rating: {feed.rating}
                        </div>

                        <Card className="border-none space-y-3 p-4 bg-green-50 rounded-lg shadow-md">
                            <CardTitle className="flex items-center text-lg">
                                <CircleCheck className="mr-2 text-green-600" />
                                Expected Answer
                            </CardTitle>
                            <CardDescription className="font-medium text-gray-700">
                                {feed.correct_ans}
                            </CardDescription>
                        </Card>

                        <Card className="border-none space-y-3 p-4 bg-yellow-50 rounded-lg shadow-md">
                            <CardTitle className="flex items-center text-lg">
                                <CircleCheck className="mr-2 text-yellow-600" />
                                Your Answer
                            </CardTitle>
                            <CardDescription className="font-medium text-gray-700">
                                {feed.user_ans}
                            </CardDescription>
                        </Card>

                        <Card className="border-none space-y-3 p-4 bg-red-50 rounded-lg shadow-md">
                            <CardTitle className="flex items-center text-lg">
                                <CircleCheck className="mr-2 text-red-600" />
                                Feedback
                            </CardTitle>
                            <CardDescription className="font-medium text-gray-700">
                                {feed.feedback}
                            </CardDescription>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default FeedbackAccordion;
