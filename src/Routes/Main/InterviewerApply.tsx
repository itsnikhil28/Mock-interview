import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpenCheck, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import accordiondata from "./accordion-interviewer-apply.json"
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { InterviewerApplyRequest, User } from "@/types";
import { useUser } from "@/provider/User-Provider";

interface FormData {
    company: string;
    experience: string;
    linkedin: string;
    message: string;
    uploadedfile: File | string | null,
}

export default function InterviewerApply() {
    const [activeFeed, setactiveFeed] = useState(0)
    const [uploadingresume, setuploadingresume] = useState(false)
    const { userId } = useAuth()
    const { userData } = useUser()
    const [userdata, setUserData] = useState<User>()
    const [loading, setloading] = useState(false)

    const [formData, setFormData] = useState<FormData>({
        company: "",
        experience: "",
        linkedin: "",
        message: "",
        uploadedfile: null as File | string | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlefileupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("resume", file);

        setuploadingresume(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/uploadResume`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload file");
            }

            const data = await response.json();
            console.log("Uploaded File URL:", data.url);

            setFormData((prev) => ({ ...prev, uploadedfile: data.url }));
            toast.success("Resume uploaded successfully!");
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Failed to upload resume. Please try again.");
        } finally {
            setuploadingresume(false);
        }
    };

    const getuserrequest = async (userId: string) => {
        try {
            const snapshot = await getDocs(query(collection(db, "interviewerapplyrequest"), where("userId", '==', userId)));
            const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as InterviewerApplyRequest);
            return requests
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    }

    const sendrequestemail = (company: string, experience: string, linkedin: string, message: string, uploadedfile: File | string) => {
        toast.success("Request Recieved! Sending email for next steps and tips.")

        if (!userdata) {
            toast.error("Error fetching details of user")
            return
        }

        const payload = {
            company,
            experience,
            linkedin,
            message,
            user: userdata,
            document: uploadedfile
        };

        try {
            fetch(`${import.meta.env.VITE_API_URL}/api/send-interviewer-request-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        toast.success(res.message);
                    } else {
                        toast.error(res.message);
                    }
                })
                .catch(err => {
                    console.error("Error sending email:", err);
                    toast.error("Something went wrong when sending mail.");
                })
        } catch (error) {
            toast.error("Something went wrong when sending mail..")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setloading(true)

        if (!userId) return

        if (!userdata) {
            toast.error("Error fetching details of user")
            return
        }

        const { company, experience, linkedin, message, uploadedfile } = formData;

        if (!company || !experience || !linkedin || !message) {
            toast.error("Please fill all the fields");
            setloading(false);
            return;
        }

        if (!uploadedfile) {
            toast.error("Please upload a document");
            setloading(false);
            return;
        }

        const checkrequest = await getuserrequest(userId) || []

        if (checkrequest.length > 0) {
            toast.error("You have already applied to become an interviewer. Please wait for your application to be reviewed.");
            setloading(false);
            return;
        }

        try {
            await addDoc(collection(db, "interviewerapplyrequest"), {
                userId,
                name: userdata.name,
                company,
                experience,
                linkedin,
                message,
                document: uploadedfile,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });

            toast.success("Request submitted Successfully")

            setFormData((prev) => ({
                ...prev,
                company: "",
                experience: "",
                linkedin: "",
                message: "",
                uploadedfile: null
            }));

            sendrequestemail(company, experience, linkedin, message, uploadedfile)

        } catch (error) {
            console.error("Error creating request:", error);
            toast.error("Failed to create request... Try again later")
        }
        finally {
            setloading(false)
        }
    };

    useEffect(() => {
        if (userData) {
            setUserData(userData)
        }
    }, [userData])

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            {/* Header Section */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">Apply to Become an Interviewer</h1>
                <p className="text-gray-600 mt-2">
                    Share your expertise and conduct interviews for real candidates.
                </p>
            </div>

            {/* Benefits Section */}
            <div className="bg-gray-100 p-6 rounded-md shadow">
                <h2 className="text-xl font-semibold text-gray-800">Why Join as an Interviewer?</h2>
                <ul className="mt-3 space-y-2 text-gray-600">
                    <li>💼 Enhance your professional reputation as an industry expert.</li>
                    <li>💰 Get paid for conducting interviews.</li>
                    <li>📢 Expand your network with top professionals.</li>
                </ul>
            </div>

            {/* Eligibility Section */}
            <div className="border-l-4 border-primary px-4 py-3 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">Who Can Apply?</h2>
                <p className="text-sm text-gray-600">
                    ✅ Minimum 3 years of experience in hiring or interviewing.<br />
                    ✅ Currently working as an interviewer in a company.<br />
                    ✅ Passionate about helping job seekers succeed.<br />
                </p>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} />
                <Input name="experience" placeholder="Years of Experience" type="number" value={formData.experience} onChange={handleChange} />
                <Input name="linkedin" placeholder="LinkedIn Profile" value={formData.linkedin} onChange={handleChange} />

                {!formData.uploadedfile && (
                    <div className="space-y-2">
                        {!uploadingresume && (
                            <>
                                <label className="text-sm">
                                    📄 Upload Your Verification Document
                                    <span className="text-sm text-gray-600">
                                        (Ensure authenticity by uploading a valid document for verification.)
                                    </span>
                                </label>
                                <div className="mt-1 flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-100 transition">
                                    <Upload className="w-5 h-5 text-blue-600" />
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="flex-1"
                                        disabled={uploadingresume}
                                        onChange={handlefileupload}
                                    />
                                </div>
                            </>
                        )}

                        {uploadingresume && (
                            <p className="text-blue-600 text-sm mt-2 flex justify-center">
                                <Loader2 className="animate-spin" />
                            </p>
                        )}
                    </div>
                )}
                {typeof formData.uploadedfile === "string" && formData.uploadedfile && (
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={() => setFormData((prev) => ({ ...prev, uploadedfile: null }))}
                            className="bg-red-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                            ❌ Remove Resume
                        </button>
                        <a
                            href={formData.uploadedfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                            📄 View Uploaded Resume
                        </a>
                    </div>
                )}

                <Textarea name="message" placeholder="Why do you want to join?" value={formData.message} onChange={handleChange} />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin size-6" /> : "Submit Application"}
                </Button>
            </form>

        {/* FAQs Section */ }
        < h2 className = "text-2xl md:text-3xl py-3 mt-20" >
            FAQs
            </h2 >
        <Accordion type="single" collapsible className="space-y-6">
            {accordiondata.map((item, i) => (
                <AccordionItem value={item.question} key={i} className="border rounded-lg shadow-md">
                    <AccordionTrigger onClick={() => setactiveFeed(item.id)}
                        className={cn("px-5 py-2 flex items-center justify-between text-base rounded-t-lg transition-colors hover:no-underline cursor-pointer",
                            activeFeed === item.id ? "bg-gradient-to-r from-purple-50 to-blue-50" : "hover:bg-gray-50")}>
                        {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-5 py-3 bg-white rounded-b-lg space-y-5 shadow-inner flex">
                        <BookOpenCheck className="inline mr-2 text-yellow-400 size-5 mb-0" />
                        <div className="font-semibold text-gray-700">
                            {item.answer}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
        </div >
    );
}
