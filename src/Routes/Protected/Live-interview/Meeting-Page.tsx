import MeetingRoom from '@/components/MeetingRoom'
import MeetingSetup from '@/components/MeetingSetup'
import { Call, StreamCall, StreamTheme, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { LoaderIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function MeetingPage() {
    const { meetingId } = useParams()
    const [call, setcall] = useState<Call>()
    const [iscallloading, setiscallloading] = useState(false)
    const client = useStreamVideoClient()
    const [isSetupComplete, setisSetupComplete] = useState(false)

    useEffect(() => {
        if (!client) return

        const getcall = async () => {
            setiscallloading(true)
            try {
                const { calls } = await client.queryCalls({ filter_conditions: { id: meetingId } })

                if (calls.length > 0) {
                    setcall(calls[0])
                }
            } catch (error) {
                console.log(error)
                setcall(undefined)
            } finally {
                setiscallloading(false)
            }
        }

        getcall()
    }, [client, meetingId])

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
                    <MeetingRoom />
                )}
            </StreamTheme>
        </StreamCall>
    )
}
