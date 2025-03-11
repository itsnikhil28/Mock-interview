import { db } from "@/config/firebase.config";
import { Resume } from "@/types"
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { SaveModal } from "./save-modal";

interface ResumeDataProps {
    resume: Resume
    // onmockpage?: boolean
}

export default function ResumeData({ resume }: ResumeDataProps) {
    const navigation = useNavigate();
    const [open, setopen] = useState(false);
    const [loading, setloading] = useState(false);

    const deletedata = async () => {
        try {
            setloading(true);
            if (resume?.id) {
                await deleteDoc(doc(db, 'resumes', resume?.id)); // Delete document from Firestore
                toast.success("Deleted!", { description: "Resume deleted successfully." });
            }
        } catch (error) {
            console.error("Error deleting document:", error);
            toast.error("Error!", { description: "Failed to delete resume" });
        } finally {
            setloading(false);
            setopen(false);
        }
    }

    return (
        <>
            {/* modal  */}
            <SaveModal isopen={open} onclose={() => setopen(false)} onconfirm={deletedata} loading={loading} />

            <div className=''>
                <Link to={`/resume/${resume?.id}`}>
                    <div className='p-14  bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 h-[280px] rounded-t-lg border-t-4'
                        style={{
                            borderColor: resume?.themecolor
                        }}
                    >
                        <div className='flex items-center justify-center h-[180px] '>
                            {/* <Notebook/> */}
                            <img src="/assets/img/cv.png" width={80} height={80} />
                        </div>
                    </div>
                </Link>
                <div className='border p-3 flex justify-between text-white rounded-b-lg shadow-lg'
                    style={{
                        background: resume?.themecolor ? resume?.themecolor : 'gray'
                    }}>
                    <h2 style={{ color: resume?.themecolor ? '' : 'black' }}>{resume?.resumeTitle}</h2>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <MoreVertical className='h-4 w-4 cursor-pointer' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => navigation(`/resume/${resume?.id}`)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigation(`/resume/${resume?.id}/view`)}>View</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigation(`/resume/${resume?.id}/view`)}>Download</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setopen(true)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </>
    )
}
