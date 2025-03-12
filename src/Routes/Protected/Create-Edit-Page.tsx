import FormMockInterview from "@/components/form-mock-interview"
import { db } from "@/config/firebase.config"
import { AiInterview } from "@/types"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function CreateEditPage() {
    const { interviewId } = useParams<{ interviewId: string }>()
    const [interview, setinterview] = useState<AiInterview | null>(null)

    const fetchinterview = async () => {
        if (interviewId) {
            try {
                const interviewdoc = await getDoc(doc(db, 'aiinterviews', interviewId))

                if (interviewdoc.exists()) {
                    setinterview({id:interviewdoc.id, ...interviewdoc.data() } as AiInterview)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        fetchinterview()
    }, [interviewId])

    return (
        <div className="my-4 flex-col w-full">
            <FormMockInterview initialdata={interview} />
        </div>
    )
}
