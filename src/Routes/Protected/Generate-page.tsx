import GenerateHeadings from "@/components/Generate-headings";
import InterviewData from "@/components/InterviewData";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/config/firebase.config";
import { AiInterview } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function GeneratePage() {
    const { userId } = useAuth()
    const [loading, setloading] = useState(false)
    const [interview, setinterview] = useState<AiInterview[]>([])

    const interviewquery = query(collection(db, 'aiinterviews'), where('userId', '==', userId))

    const unsubscribe = onSnapshot(interviewquery, (snapshot) => {
        const interviewlist: AiInterview[] = snapshot.docs.map(doc => {
            const id = doc.id
            return { id, ...doc.data() }
        }) as AiInterview[]

        setinterview(interviewlist)
        setloading(false)
    }, (error) => {
        console.log(error)
        toast.error("Error..", {
            description: "Something went wrong.. Try again later.."
        })
        setloading(false)
    })
    useEffect(() => {
        setloading(true)
        return () => unsubscribe()
    }, [userId])

    return (
        <>
            <div className="flex w-full justify-between items-center">
                <GenerateHeadings title="Dashboard" description="Create and start your AI Mock interview" />

                <Link to={'create'}>
                    <Button size={"sm"}><Plus /> Add New </Button></Link>
            </div>

            <Separator className="my-8" />

            <div className="md:grid md:grid-cols-3 gap-3 py-4 flex flex-col justify-center items-center ">
                {loading ? Array.from({ length: 3 }).map((_, index) => (
                    <div className="flex flex-col space-y-3 mt-7" key={index}>
                        <Skeleton className="h-[125px] w-[200px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                    </div>
                )) : interview.length > 0 ? interview.map((item, i) => (
                    <InterviewData key={i} interview={item} />
                )) : (
                    <div className="md:col-span-3 w-full flex flex-grow items-center justify-center h-96 flex-col">
                        <img src="/assets/svg/not-found.svg" className="w-44 h-44 object-contain" alt="" />

                        <h2 className="text-lg font-semibold text-muted-foreground">
                            No Data Found
                        </h2>

                        <p className="w-full md:w-96 text-center text-sm text-neutral-400 mt-4">
                            There is no available data to show. Please add some new mock interviews
                        </p>

                        <Link to={"/generate/create"} className="mt-4">
                            <Button size={"sm"}>
                                <Plus className="min-w-5 min-h-5 mr-1" />
                                Add New
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}
