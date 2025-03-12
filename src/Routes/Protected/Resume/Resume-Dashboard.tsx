import GenerateHeadings from "@/components/Generate-headings";
import ResumeData from "@/components/ResumeData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/config/firebase.config";
import { Resume } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { Separator } from "@radix-ui/react-separator";
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { Loader, Plus, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ResumeDashboard() {
    const { userId } = useAuth()
    const [loading, setloading] = useState(false)
    const [resumetitle, setresumetitle] = useState('')
    const [resume, setresume] = useState<Resume[]>([])
    const [open, setopen] = useState(false)
    const toastmessage = { title: "Created..!", description: "New Resume Title Created..." }
    const navigate = useNavigate()

    const addresumetitle = async () => {
        setloading(true)
        setopen(false)

        if (!resumetitle.trim()) {
            toast.error("Please enter a resume title.");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "resumes"), {
                userId, // Associate resume with user
                resumeTitle: resumetitle,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });
            toast(toastmessage.title, { description: toastmessage.description })
            navigate(`/resume/${docRef.id}`)

        } catch (error) {
            toast.error("Something went wrong")
            console.error("Error adding resume:", error);
        } finally {
            setloading(false)
        }
    }

    const resumequery = query(collection(db, 'resumes'), where('userId', '==', userId))

    const unsubscribe = onSnapshot(resumequery, (snapshot) => {
        const resumelist: Resume[] = snapshot.docs.map(doc => {
            const id = doc.id
            return { id, ...doc.data() }
        }) as Resume[]

        setresume(resumelist)
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
            {/* modal  */}
            <Dialog open={open}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Resume</DialogTitle>
                        <DialogDescription asChild>
                            <div>
                                <p className="my-3">Add a title for your new resume</p>
                                <Input className="my-2" placeholder="Ex:- Full Stack resume" onChange={(e) => setresumetitle(e.target.value)}
                                />
                            </div>
                        </DialogDescription>
                        <div className='flex justify-end gap-5'>
                            <Button onClick={() => setopen(false)} variant="ghost">Cancel</Button>
                            <Button disabled={!resumetitle || loading} onClick={() => addresumetitle()}>
                                {loading ? (<Loader className="text-gray-50 animate-spin" />) : "Create"}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <div className="flex w-full justify-between items-center">
                <GenerateHeadings title="My Resume" description="Make AI resume for your next Job role" />

                <Button size={"sm"} onClick={() => setopen(!open)}><Plus /> Add New </Button>
            </div>

            <Separator className="my-8" />

            <div className="md:grid md:grid-cols-3 gap-3 py-4 flex flex-col justify-center items-center ">
                {loading || resume.length > 0 &&(
                    <div className='' onClick={()=>setopen(!open)}>
                        <div className='p-14 bg-gray-200 h-[280px] rounded-t-lg border-t-4'
                            style={{
                                // borderColor: resume?.themecolor
                            }}
                        >
                            <div className='flex items-center justify-center h-[180px] '>
                                {/* <Notebook/> */}
                                <Button variant={"default"}><PlusIcon /> Add</Button>
                            </div>
                        </div>
                    </div>
                )}
                {loading ? Array.from({ length: 3 }).map((_, index) => (
                    <div className="flex flex-col space-y-3 mt-7" key={index}>
                        <div className='h-[280px] rounded-lg bg-slate-200 animate-pulse'>
                        </div>
                    </div>
                )) : resume.length > 0 ? resume.map((item, i) => (
                    <ResumeData key={i} resume={item} />
                )) : (
                    <div className="md:col-span-3 w-full flex flex-grow items-center justify-center h-96 flex-col">
                        <img src="/assets/svg/not-found.svg" className="w-44 h-44 object-contain" alt="" />

                        <h2 className="text-lg font-semibold text-muted-foreground">
                            No Data Found
                        </h2>

                        <p className="w-full md:w-96 text-center text-sm text-neutral-400 mt-4">
                            There is no available data to show. Please add atleast one resume
                        </p>

                        <Button size={"sm"} onClick={() => setopen(!open)} className=" mt-4">
                            <Plus className="min-w-5 min-h-5 mr-1" />
                            Add New
                        </Button>
                    </div>
                )}
            </div>
        </>
    )
}
