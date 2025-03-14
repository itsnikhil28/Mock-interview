import { FilePlusIcon, Loader2, LoaderIcon, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { RequestedInterview, Resume, User } from "@/types";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import UserInfo from "./UserInfo";
import { toast } from "sonner";

export default function CandidateRequestForm({ onClose }: { onClose: () => void }) {
    const [loading, setloading] = useState(false)
    const { userId } = useAuth()
    const [userresume, setuserresume] = useState<Resume[]>([]);
    const [interviewer, setinterviewer] = useState<User[]>([])
    const [loadingresumes, setloadingresumes] = useState(false)
    const [loadinginterviewer, setloadinginterviewer] = useState(false)
    const [selectedResume, setSelectedResume] = useState<string>('');

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        interviewerId: "",
        uploadedfile: null as File | null
    });

    //get all resumes
    const getallresumes = async () => {
        setloadingresumes(true)
        try {
            const usersSnapshot = await getDocs(query(collection(db, "resumes"), where("userId", "==", userId)));
            const resumes = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Resume);
            setuserresume(resumes);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setloadingresumes(false)
        }
    };

    //get all interviewers
    const getallinterviewers = async () => {
        setloadinginterviewer(true);
        try {
            const snapshot = await getDocs(query(collection(db, "users"), where("role", "==", "interviewer")));
            const interviewers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as User);
            setinterviewer(interviewers);
        } catch (error) {
            console.error("Error fetching interviews:", error);
        } finally {
            setloadinginterviewer(false);
        }
    };

    const getuserinterviewwithinterviewer = async (interviewerId: string) => {
        try {
            const snapshot = await getDocs(query(collection(db, "requestedinterviews"), where("interviewerId", "==", interviewerId), where("userId", '==', userId)));
            const interviewers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as RequestedInterview);
            return interviewers
        } catch (error) {
            console.error("Error fetching interviews:", error);
        }
    };

    const handlesubmit = async () => {
        setloading(true)
        if (!userId) return

        const { name, email, uploadedfile, interviewerId } = formData;

        if (!name || !email || !interviewerId) {
            toast.error("Please fill all the fields");
            setloading(false);
            return;
        }

        if (!selectedResume && !uploadedfile) {
            toast.error("Please select a resume or upload a new one.");
            setloading(false);
            return;
        }

        if (selectedResume && uploadedfile) {
            toast.error("Please select only one option: either choose from existing resumes or upload a new one.");
            setloading(false);
            return;
        }

        const checkinterview = await getuserinterviewwithinterviewer(interviewerId) || []

        if (checkinterview.length > 0) {
            toast.error("You have already requested an interview with this interviewer. Please choose a different interviewer or wait for your current request to be scheduled.");
            setloading(false);
            return;
        }

        try {
            await addDoc(collection(db, "requestedinterviews"), {
                userId,
                interviewerId,
                userName: name,
                userEmail: email,
                resume: selectedResume || (uploadedfile ? uploadedfile.name : null),
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });

            toast.success("Request submitted Successfully")
            onClose()

            setFormData((prev) => ({
                ...prev,
                name: "",
                email: "",
                interviewerId: "",
                uploadedfile: null
            }));

            setSelectedResume("");

        } catch (error) {
            console.error("Error creating interview:", error);
            toast.error("Failed to schedule meeting... Try again later")
        }
        finally {
            setloading(false)
        }

    }

    useEffect(() => {
        getallresumes()
        getallinterviewers()
    }, [])

    useEffect(() => {
        if (userresume.length > 0) {
            setFormData((prev) => ({
                ...prev,
                name: userresume[0]?.firstName + " " + userresume[0]?.lastName || "",
                email: userresume[0]?.email || "",
            }));
        }
    }, [userresume]);

    return (
        <>
            <Separator className="my-1" />
            {loadingresumes || loadinginterviewer ? (
                <div className="h-[30vh] md:h-[50vh] flex justify-center items-center">
                    <LoaderIcon className="w-10 h-10 min-w-10 min-h-10 animate-spin" />
                </div>
            ) : (
                <div className="space-y-4 p-3">

                    {/* User Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            placeholder="Enter your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* User Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            placeholder="Enter Your Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* User Resume Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Resume</label>
                        {userresume.length > 0 ? (
                            <Select value={selectedResume} onValueChange={(id) => setSelectedResume(id)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Resume" />
                                </SelectTrigger>
                                <SelectContent>
                                    {userresume.map((item, index) => (
                                        <SelectItem key={index} value={item.id}>{item.resumeTitle}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="space-y-4 p-6 border border-gray-300 rounded-lg bg-gray-50 shadow-md">
                                <div className="flex gap-4 items-center justify-center mb-0">
                                    <FilePlusIcon className="w-10 h-10" />
                                    <p className="text-sm text-gray-700 font-medium text-center">
                                        You don't have any resumes yet. Create one now!
                                    </p>
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={() => window.location.href = "/upload-resume"}>
                                        Create
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* OR Upload a new resume */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">OR Upload a New Resume:</label>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-100 transition">
                            <Upload className="w-5 h-5 text-blue-600" />
                            <Input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="flex-1"
                                onChange={(e) => setFormData({ ...formData, uploadedfile: e.target.files?.[0] || null })}
                            />
                        </div>
                    </div>

                    {/* Interviewers Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Interviewers</label>
                        {interviewer.length > 0 && (
                            <Select value={formData.interviewerId} onValueChange={(id) => setFormData({ ...formData, interviewerId: id })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Add interviewer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {interviewer.map((item, index) => (
                                        <SelectItem key={index} value={item.id}>
                                            <UserInfo user={item} />
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant={"outline"} onClick={onClose}>Cancel</Button>
                        <Button onClick={handlesubmit} disabled={loading}>{loading ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : "Submit Request"}</Button>
                    </div>

                </div>
            )}
        </>
    )
}
