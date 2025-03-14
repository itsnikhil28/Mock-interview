import Resumepreview from "@/components/Resume-preview";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase.config";
import { ResumeContext } from "@/Context/Resume-context";
import { Resume } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Resumeview() {
    const { resumeId } = useParams<{ resumeId: string }>()
    const [resume, setresume] = useState<Resume | null>(null)
    const [loading, setloading] = useState(false)

    const HandleDownload = () => {
        const printContent = document.getElementById("print-area");
        const originalContent = document.body.innerHTML;

        if (printContent) {
            document.body.innerHTML = printContent.innerHTML;
            window.print();
            document.body.innerHTML = originalContent;
        }
    }

    const fetchresume = async () => {
        setloading(true)

        if (resumeId) {
            try {
                const resumedoc = await getDoc(doc(db, 'resumes', resumeId))

                if (resumedoc.exists()) {
                    setresume({ id: resumedoc.id, ...resumedoc.data() } as Resume)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setloading(false)
            }
        }
    }

    useEffect(() => {
        fetchresume()
    }, [])

    return (
        <ResumeContext.Provider value={{ initialdata: resume ?? null }}>
            <div>
                <div id="no-print-area">
                    <div className='my-10'>
                        <h2 className='text-2xl font-medium flex justify-between'>
                            Congrats! Your Ultimate AI generates Resume is ready !
                            <Button onClick={HandleDownload}>Download</Button>
                        </h2>
                        <p className='text-gray-400'>Now you are ready to download your resume and you can share unique
                            resume url with your friends and family </p>
                    </div>
                </div>
                <div id="print-area" className="mb-20">
                    {loading ? (
                        <div className="h-[50vh] w-full flex justify-center items-center">
                            <Loader className="animate-spin size-10" />
                        </div>
                    ) : (
                        <div className="max-w-[1000px] w-full mx-auto py-5 px-4 sm:px-6 lg:px-8">
                            <Resumepreview />
                        </div>
                    )}
                </div>
            </div>
        </ResumeContext.Provider >
    )
}
