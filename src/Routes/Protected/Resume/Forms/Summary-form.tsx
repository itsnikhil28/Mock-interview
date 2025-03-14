import { ResumeContext } from "@/Context/Resume-context";
import { Formsectionprops, resumeprops } from "./Personal-detail-form";
import { useContext, useEffect, useState } from "react";
import { chatSession } from "@/scripts";
import { Button } from "@/components/ui/button";
import { BrainIcon, LoaderCircle } from "lucide-react";
import { cleanAiResponse } from "@/components/clean-airesponse";
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { toast } from "sonner";

const formschema = z.object({
    summary: z.string().min(1, 'Summary is required').max(300, 'Summary must be 300 characters or less'),
})

type FormData = z.infer<typeof formschema>

export default function Summaryform({ enableNext, refreshData }: Formsectionprops) {
    const { initialdata } = useContext(ResumeContext) as resumeprops;

    const form = useForm<FormData>({
        resolver: zodResolver(formschema),
        defaultValues: initialdata || {}
    })

    const { isValid, isSubmitting } = form.formState
    const [summary, setSummary] = useState('');
    const [loading, setloading] = useState(false);
    const [ailoading, setailoading] = useState(false)
    const [aiGeneratedSummaryList, setAiGenerateSummaryList] = useState<any[] | null>(null);
    const actions = initialdata?.summary ? "Update" : "Create"
    const toastmessage = initialdata?.firstName ? { title: "Updated..!", description: "Changes saved Successfully..." } : { title: "Created..!", description: "Personal detailed added" }


    const generateairesponse = async ({ initialdata }: resumeprops) => {
        setailoading(true)
        const prompt = `Job Title: ${initialdata?.jobTitle} , Depends on job title give me list of summary for 3 experience level, senior level, Mid Level and Fresher level in 3 - 4 lines in array format, with only summary and experience_level, experience_level to be in max 50 words field strictly not other thing in JSON Format
        [
          { "summary": "<Summary text>", "experience_level": "<Experience Level text>" },
          ...
        ]`

        try {
            const aiResult = await chatSession.sendMessage(prompt);

            if (!aiResult) return null;

            const responseText = aiResult.response.text();
            const cleanedResponse = cleanAiResponse(responseText);

            setAiGenerateSummaryList(cleanedResponse);
        } catch (error) {
            console.error("Error fetching AI response:", error);
        } finally {
            setailoading(false);
        }
    }

    const onsubmit = async (data: FormData) => {
        try {
            setloading(true)
            if (initialdata?.id) {

                //update
                if (isValid) {
                    await updateDoc(doc(db, 'resumes', initialdata?.id), {
                        ...data,
                        updated_at: serverTimestamp(),
                    })

                    refreshData()
                    toast(toastmessage.title, { description: toastmessage.description })
                    enableNext(true)
                }
            }

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
                summary: initialdata.summary,
            })

            if (!initialdata?.summary) {
                enableNext(false)
            }
        }
    }, [initialdata, form])
    return (
        <>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Summary</h2>
                <p>Add Summary for your job title</p>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)} className="mt-4">
                        <div className='flex justify-between items-end'>
                            <label>Add Summary</label>
                            <Button variant="outline" onClick={() => generateairesponse({ initialdata })}
                                type="button" size="sm" className="border-primary text-primary flex gap-2">
                                <BrainIcon className='h-4 w-4' /> {ailoading ? 'Generating..' : 'Generate from AI'}</Button>
                        </div>
                        {/* position  */}
                        <FormField control={form.control} name="summary" render={({ field }) => (
                            <FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between mt-7">
                                    <FormLabel>Summary</FormLabel>
                                </div>
                                <FormMessage className="text-sm" />
                                <FormControl>
                                    <Textarea disabled={loading} className="h-30" placeholder="Enter summary or generate from ai" {...field} value={summary || field.value} onChange={(e) => {setSummary(e.target.value);field.onChange(e)}} />
                                </FormControl>
                            </FormItem>
                        )} />
                        <div className='mt-2 flex justify-end'>
                            <Button type="submit" size={"sm"} disabled={isSubmitting || loading}>{loading ? (<LoaderCircle className="text-gray-50 animate-spin" />) : (actions)}</Button>
                        </div>
                    </form>
                </FormProvider>
            </div>

            {aiGeneratedSummaryList && <div className='my-5'>
                <h2 className='font-bold text-lg'>Suggestions</h2>
                {aiGeneratedSummaryList?.map((item, index) => (
                    <div key={index}
                        onClick={() => {
                            setSummary(item?.summary)
                            form.setValue("summary", item?.summary);
                            form.trigger("summary");
                        }}
                        className='p-5 shadow-lg my-4 rounded-lg cursor-pointer'>
                        <h2 className='font-bold my-1 text-primary'>Level: {item?.experience_level}</h2>
                        <p>{item?.summary}</p>
                    </div>
                ))}
            </div>}
        </>
    )
}
