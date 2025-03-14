import Custombreadcrumb from "@/components/Custom-breadcrumb"
import RecordingCard from "@/components/RecordingCard"
import { useUser } from "@clerk/clerk-react"
import { Call, CallRecording, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { LoaderIcon } from "lucide-react"
import { useEffect, useState } from "react"

export default function RecordingPage() {
    const { user } = useUser()
    const client = useStreamVideoClient()
    const [calls, setCalls] = useState<Call[]>()
    const [loading, setloading] = useState(false)
    const [recordings, setrecordings] = useState<CallRecording[]>([])

    useEffect(() => {
        const loadcalls = async () => {
            if (!client || !user?.id) return

            setloading(true)
            try {
                const { calls } = await client.queryCalls({
                    sort: [{ field: "starts_at", direction: -1 }],
                    filter_conditions: {
                        starts_at: { $exists: true },
                        $or: [{ created_by_user_id: user.id }, { members: { $in: [user.id] } }]
                    }
                })

                setCalls(calls)

            } catch (error) {
                console.log("Here is the error : ", error)
            } finally {
                setloading(false)
            }

        }

        loadcalls()
    }, [client, user?.id])

    // const now = new Date()

    // const endedcalls = calls?.filter(({state : {startsAt,endedAt}}:Call)=>{
    //     return (startsAt && new Date(startsAt) < now) || !!endedAt
    // })

    // const upcomingcalls = calls?.filter(({ state: { startsAt } }: Call) => {
    //     return (startsAt && new Date(startsAt) > now)
    // })

    // const livecalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
    //     return startsAt && new Date(startsAt) < now && !endedAt
    // })

    useEffect(() => {
        const fetchrecordings = async () => {
            setloading(true)
            if (!calls || calls.length === 0) return
            try {
                const calldata = await Promise.all(calls.map((call) => call.queryRecordings()))
                const allrecordings = calldata.flatMap((call) => call.recordings)

                setrecordings(allrecordings)
            } catch (error) {
                console.log("Error Fetching records: ", error)
            } finally {
                setloading(false)
            }
        }

        fetchrecordings()
    }, [calls])

    if (loading) return (
        <div className="h-[40vh] md:h-[70vh] flex justify-center items-center">
            <LoaderIcon className="w-10 h-10 min-w-10 min-h-10 animate-spin" />
        </div>
    )
    return (
        <div className="container max-w-7xl mx-auto p-6 space-y-8">

            <Custombreadcrumb breadCrumpPage={recordings.length === 1 ? "Recording" : "Recordings"} breadCrumpItems={[{ label: "Dashboard", link: '/interviewer/dashboard' }]} />
            {/* Header info  */}

            <div>
                <h1 className="text-3xl font-bold mt-5 mb-2">Recordings</h1>

                <p className="text-accent-foreground my-1">
                    {recordings === undefined ? "Loading recordings..." : `${recordings.length} ${recordings.length === 1 ? "recording" : "recordings"} available`}
                </p>
            </div>

            {/* RECORDINGS GRID */}

            {/* <ScrollArea className="h-[calc(100vh-12rem)] mt-3"> */}
            {recordings && recordings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
                    {recordings.map((r) => (
                        <RecordingCard key={r.end_time} recording={r} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                    <p className="text-xl font-medium text-muted-foreground">No recordings available</p>
                </div>
            )}
            {/* </ScrollArea> */}
        </div>
    )
}
