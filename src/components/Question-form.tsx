import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils";
import TooltipButton from "./tooltip-button";
import { Volume2, VolumeX } from "lucide-react";
import RecordAnswer from "./Record-answer";

interface QuestionSectionprops {
    questions: { question: string; answer: string }[]
}

export default function QuestionSection({ questions }: QuestionSectionprops) {
    const [isplaying, setisplaying] = useState(false)
    const [iswebcam, setiswebcam] = useState(false)
    const [currentspeech, setcurrentspeech] = useState<SpeechSynthesisUtterance | null>(null)

    const handleplayquestion = (qst: string) => {
        if (isplaying && currentspeech) {
            window.speechSynthesis.cancel()
            setisplaying(false)
            setcurrentspeech(null)
        }else{
            if('speechSynthesis' in window){
                const speech = new SpeechSynthesisUtterance(qst)

                const voices = window.speechSynthesis.getVoices();

                // speech.voice = voices.find(v => v.name.includes("Google हिन्दी")) || voices[0];
                speech.voice = voices.find(v => v.name.includes("Google UK English Female")) || voices[0];
                
                speech.rate = 1;   // Speed (default: 1)
                speech.pitch = 0.8;  // Pitch (default: 1)
                speech.volume = 0.7; // Volume (0 to 1)

                window.speechSynthesis.speak(speech)
                setisplaying(true)
                setcurrentspeech(speech)

                speech.onend = () => {
                    setisplaying(false)
                    setcurrentspeech(null)
                }
            }
        }
    }

    return (
        <div className="w-full min-h-96 border rounded-md p-4">
            <Tabs defaultValue={questions[0]?.question}
                className="w-full space-y-12"
                orientation="vertical">
                <TabsList className="bg-transparent w-full flex flex-wrap items-center justify-start gap-4">
                    {questions.map((item, i) => (
                        <TabsTrigger className={cn('data-[state=active]:bg-emerald-200 data-[state=active]:shadow-md text-xs px-2')} key={i} value={item.question}>
                            {`Question ${i + 1}`}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {questions.map((item, i) => (
                    <TabsContent key={i} value={item.question}>
                        <p className="text-base text-left tracking-wide text-neutral-500">{item.question}</p>

                        <div className="w-full flex items-center justify-end">
                            <TooltipButton content={isplaying ? "Stop" : 'Start'} icon={
                                isplaying ? (
                                    <VolumeX className="min-w-5 min-h-5 text-muted-foreground" />
                                ) : (
                                    <Volume2 className="min-w-5 min-h-5 text-muted-foreground" />
                                )
                            } onClick={() => handleplayquestion(item.question)}></TooltipButton>
                        </div>

                        <RecordAnswer question={item} iswebcam={iswebcam} setiswebcam={setiswebcam} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
