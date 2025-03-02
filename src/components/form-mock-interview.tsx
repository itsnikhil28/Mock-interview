import { Interview } from "@/types"
import Custombreadcrumb from "./Custom-breadcrumb"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { toast } from "sonner"
import GenerateHeadings from "./Generate-headings"
import { Button } from "./ui/button"
import { Loader, Trash2 } from "lucide-react"
import { Separator } from "./ui/separator"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { chatSession } from "@/scripts"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { db } from "@/config/firebase.config"

interface FormMockInterviewprops {
    initialdata: Interview | null
}

const formschema = z.object({
    position: z.string().min(1, 'Position is required').max(100, 'Position must be 100 characters or less'),
    description: z.string().min(10, 'Description is required and more than 10 characters'),
    experience: z.coerce.number().min(0, "Experience cannot be empty or negative"),
    techstack: z.string().min(1, "Tech Stack must be at least a character"),
})

type FormData = z.infer<typeof formschema>

export default function FormMockInterview({ initialdata }: FormMockInterviewprops) {

    const form = useForm<FormData>({
        resolver: zodResolver(formschema),
        defaultValues: initialdata || {}
    })

    const { isValid, isSubmitting } = form.formState
    const [loading, setloading] = useState(false)
    const navigate = useNavigate()
    const { userId } = useAuth()

    const title = initialdata?.position ? initialdata?.position : "Create a new Mock Interview"

    const breadCrumpPage = initialdata?.position ? initialdata?.position : "Create "

    const actions = initialdata ? "Save Changes" : "Create "

    const toastmessage = initialdata ? { title: "Updated..!", description: "Changes saved Successfully..." } : { title: "Created..!", description: "New Mock Interview Created..." }

    const cleanAiResponse = (responseText: string): any[] | null => {
        try {
            // Step 1: Trim surrounding whitespace
            let cleanText = responseText.trim();

            // Step 2: Remove "json" or code block symbols
            cleanText = cleanText.replace(/(json|```|`)/g, "");

            // Step 3: Extract the first JSON array found
            const jsonArrayMatch = cleanText.match(/\[.*\]/s);

            if (!jsonArrayMatch) {
                console.error("cleanAiResponse: No JSON array found in response:", responseText);
                return null;
            }

            cleanText = jsonArrayMatch[0];

            // Step 4: Parse the clean JSON text
            try {
                const parsedJson = JSON.parse(cleanText);

                // Check if it's an array
                if (!Array.isArray(parsedJson)) {
                    console.error("cleanAiResponse: Parsed JSON is not an array:", cleanText);
                    return null;
                }

                return parsedJson;
            } catch (parseError) {
                console.error("cleanAiResponse: Invalid JSON format:", parseError, cleanText);
                return null;
            }
        } catch (error) {
            console.error("cleanAiResponse: Unexpected error:", error, responseText);
            return null;
        }
    };

    const generateairesponse = async (data: FormData) => {
        const prompt = `
        As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information. Each object in the array should have the fields "question" and "answer", formatted as follows:

        [
          { "question": "<Question text>", "answer": "<Answer text>" },
          ...
        ]

        Job Information:
        - Job Position: ${data?.position}
        - Job Description: ${data?.description}
        - Years of Experience Required: ${data?.experience}
        - Tech Stacks: ${data?.techstack}

       Job Information:
        - Job Position: ${data?.position || 'N/A'}
        - Job Description: ${data?.description || 'N/A'}
        - Years of Experience Required: ${data?.experience || 'N/A'}
        - Tech Stacks: ${data?.techstack || 'N/A'}

        The questions should be at an intermediate difficulty level, assess skills in ${data?.techstack || 'N/A'} development, best practices, problem-solving, and experience handling complex requirements. 
        The answers should be detailed, providing clear explanations of the reasoning behind the solutions and just use paragraph to give answer not code. 
        The tone of the response should be professional and technical.

        Example:
        [
        {
            "question": "Explain the concept of [Specific Tech Concept related to ${data?.techstack || 'N/A'}] and provide a practical example.",
            "answer": "The concept of [Specific Tech Concept] involves... [Detailed explanation and example]."
        },
        ...
        ]

        Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations. Return only the JSON array with questions and answers.
        `;

        const aiResult = await chatSession.sendMessage(prompt);
        const cleanedResponse = cleanAiResponse(aiResult.response.text());

        if (!cleanedResponse) {
            return null;
        } else {
            return cleanedResponse
        }
    };

    const onsubmit = async (data: FormData) => {
        try {
            setloading(true)
            if (initialdata) {
                //update
                if (isValid) {
                    const airesult = await generateairesponse(data)

                    await updateDoc(doc(db, 'interviews', initialdata?.id), {
                        questions: airesult,
                        ...data,
                        updated_at: serverTimestamp(),
                    })

                    toast(toastmessage.title, { description: toastmessage.description })
                }
            } else {
                if (isValid) {
                    const airesult = await generateairesponse(data)
                    await addDoc(collection(db, 'interviews'), {
                        ...data,
                        userId,
                        questions: airesult,
                        created_at: serverTimestamp(),
                        updated_at: serverTimestamp()
                    })

                    toast(toastmessage.title, { description: toastmessage.description })
                }
            }

            navigate('/generate', { replace: true })
        } catch (error) {
            console.log(error);
            toast.error("Error..", {
                description: 'Something went wrong. Please try again later',
            })
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        if (initialdata) {
            form.reset({
                position: initialdata.position,
                description: initialdata.description,
                experience: initialdata.experience,
                techstack: initialdata.techstack,
            })
        }
    }, [initialdata, form])


    return (
        <div className="w-full flex-col space-y-4">
            <Custombreadcrumb breadCrumpPage={breadCrumpPage} breadCrumpItems={[{ label: "Mock Interview", link: '/generate' }]} />

            <div className="mt-4 flex items-center justify-between w-full">
                <GenerateHeadings title={title} issubheading />

                {initialdata && (
                    <Button size={"icon"} variant={"ghost"}>
                        <Trash2 className="min-w-4 min-h-4 text-red-500" />
                    </Button>
                )}
            </div>

            <Separator className="my-4" />

            <div className="my-6">
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)} className="w-full p-8 rounded-lg flex flex-col items-start justify-start gap-6 shadow-md">
                        {/* position  */}
                        <FormField control={form.control} name="position" render={({ field }) => (
                            <FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>Job Role / Job Position</FormLabel>
                                </div>
                                <FormMessage className="text-sm" />
                                <FormControl>
                                    <Input disabled={loading} className="h-12" placeholder="eg:- Full Stack Developer" {...field} value={field.value || ""} />
                                </FormControl>
                            </FormItem>
                        )} />

                        {/* description  */}
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>Job Description</FormLabel>
                                </div>
                                <FormMessage className="text-sm" />
                                <FormControl>
                                    <Textarea disabled={loading} className="h-12" placeholder="eg:- Your Job role or position" {...field} value={field.value || ""} />
                                </FormControl>
                            </FormItem>
                        )} />

                        {/* experience  */}
                        <FormField control={form.control} name="experience" render={({ field }) => (
                            <FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>Years of experience</FormLabel>
                                </div>
                                <FormMessage className="text-sm" />
                                <FormControl>
                                    <Input type="number" disabled={loading} className="h-12" placeholder="eg:- 0 or more" {...field} value={field.value || ""} />
                                </FormControl>
                            </FormItem>
                        )} />

                        {/* techstack  */}
                        <FormField control={form.control} name="techstack" render={({ field }) => (
                            <FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>Tech Stacks</FormLabel>
                                </div>
                                <FormMessage className="text-sm" />
                                <FormControl>
                                    <Textarea disabled={loading} className="h-12" placeholder="eg:- React, Typescript..." {...field} value={field.value || ""} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <div className="w-full flex items-center justify-end gap-6">
                            <Button type="button" size={"sm"} variant={"outline"} disabled={isSubmitting || loading}
                                // onClick={() => 
                                //     // console.log("Form Reset Function:", form.reset)
                                // }
                            >Reset</Button>
                            <Button type="submit" size={"sm"} disabled={isSubmitting || loading || !isValid}>{loading ? (<Loader className="text-gray-50 animate-spin" />) : (actions)}</Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    )
}
