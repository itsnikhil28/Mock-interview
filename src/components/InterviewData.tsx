import { Interview } from "@/types"
import { useAuth } from "@clerk/clerk-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "./ui/badge"
import { cn } from "@/lib/utils"
import TooltipButton from "./tooltip-button"
import { Eye, Newspaper, Sparkles } from "lucide-react"


interface InterviewDataProps {
    interview: Interview
    onmockpage?: boolean
}

export default function InterviewData({ interview, onmockpage = false }: InterviewDataProps) {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const { userId } = useAuth()

    const ondelete = async () => {

    }

    return (
        <Card className="p-4 rounded-md shadow-none hover:shadow-md shadow-gray-100 cursor-pointer transition-all space-y-4">
            <CardHeader className="mb-0 p-0">
                <CardTitle className="text-lg">{interview?.position.toLocaleUpperCase()}</CardTitle>
                <CardDescription>{interview?.description}</CardDescription>
            </CardHeader>
            <CardContent className="mb-0 p-0">
                <div className="w-full flex items-center gap-2 flex-wrap">
                    {interview.techstack.split(",").map((word, i) => (
                        <Badge key={i} variant={"outline"} className="text-[13px] text-muted-foreground hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900">{word}</Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className={cn('w-full flex items-center p-0', onmockpage ? "justify-end" : 'justify-between')}>
                <p className="text-[12px] text-muted-foreground truncate whitespace-nowrap">
                    {`${new Date(interview.created_at.toDate()).toLocaleDateString('en-US', { dateStyle: 'long' })} - ${new Date(interview.created_at.toDate()).toLocaleTimeString('en-US', { timeStyle: 'short' })}`}
                </p>

                {!onmockpage && (
                    <div className="flex items-center justify-center">
                        {/* view */}
                        <TooltipButton content="View" buttonVariant={"ghost"} onClick={() => (
                            navigate(`/generate/${interview.id}`, { replace: true })
                        )} disabled={false} buttonClassName="hover:text-sky-500" icon={<Eye />} loading={false} />

                        {/* edit  */}
                        <TooltipButton content="Feedback" buttonVariant={"ghost"} onClick={()=>(
                            navigate(`/generate/feedback/${interview.id}`,{replace:true})
                        )} disabled={false} buttonClassName="hover:text-yellow-500" icon={<Newspaper />} loading={false} />

                        {/* start */}
                        <TooltipButton content="Start" buttonVariant={"ghost"} onClick={() => (
                            navigate(`/generate/interview/${interview.id}`, { replace: true })
                        )} disabled={false} buttonClassName="hover:text-green-500" icon={<Sparkles />} loading={false} />
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
