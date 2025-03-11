import ResumeMock from "@/components/Resume-mock"
import { db } from "@/config/firebase.config"
import { Resume } from "@/types"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function ResumeCreate() {
    const { resumeId } = useParams<{ resumeId: string }>()
    const [resume, setresume] = useState<Resume | null>(null)

    const fetchresume = async () => {
        if (resumeId) {
            try {
                const resumedoc = await getDoc(doc(db, 'resumes', resumeId))

                if (resumedoc.exists()) {
                    setresume({ id: resumedoc.id, ...resumedoc.data() } as Resume)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        fetchresume()
    }, [resumeId])

    return (
        <div className="my-4 flex-col w-full">
            <ResumeMock initialdata={resume} refreshData={fetchresume} />
        </div>
    )
}
