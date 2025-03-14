import { useContext, useEffect, useState } from "react";
import { Formsectionprops, resumeprops } from "./Personal-detail-form";
import { ResumeContext } from "@/Context/Resume-context";
import { z } from "zod";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { toast } from "sonner";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrainIcon, Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "../Preview/Experience-preview";
import { chatSession } from "@/scripts";
import { cleanAiResponse } from "@/components/clean-airesponse";

const formschema = z.object({
    experience: z.array(z.object({
        title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
        companyName: z.string().min(1, 'Company name is required').max(100, 'Company name must be 100 characters or less'),
        city: z.string().min(1, 'City is required').max(100, 'City must be 100 characters or less'),
        state: z.string().min(1, "State is required").max(100, "State must be 100 characters or less"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string(),
        workSummary: z.string().min(1, "Work summary is required").max(400,'Work summary must be 400 characters or less'),
    }))
});

type FormData = z.infer<typeof formschema>;

export default function ExperienceForm({ enableNext, refreshData }: Formsectionprops) {
    const { initialdata } = useContext(ResumeContext) as resumeprops;

    const form = useForm<FormData>({
        resolver: zodResolver(formschema),
        defaultValues: {
            experience: initialdata?.experience?.map(exp => ({
                title: exp.title || '',
                companyName: exp.companyName || '',
                city: exp.city || '',
                state: exp.state || '',
                startDate: formatDate(exp.startDate) || '',
                endDate: formatDate(exp.endDate) || '',
                workSummary: exp.workSummary || '',
            })) || [{
                title: '',
                companyName: '',
                city: '',
                state: '',
                startDate: '',
                endDate: '',
                workSummary: '',
            }]
        }

    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "experience",
    });

    const { isValid, isSubmitting } = form.formState;
    const [loading, setLoading] = useState(false);
    // const [summary, setSummary] = useState('');
    const [ailoading, setailoading] = useState<boolean[]>(Array(fields.length).fill(false));

    const actions = initialdata?.experience?.length !== 0 ? "Update" : "Create";
    const toastmessage = initialdata?.experience?.length !== 0
        ? { title: "Updated..!", description: "Changes saved Successfully..." }
        : { title: "Created..!", description: "Experience details added" };

    const generateairesponse = async (index: number) => {
        setailoading((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
        });

        const positionTitle = form.getValues(`experience.${index}.title`);

        if (!positionTitle) {
            toast.error("Please enter a position title before generating AI response.");
            setailoading((prev) => {
                const newState = [...prev];
                newState[index] = false
                return newState;
            });
            return;
        }

        // const PROMPT = `Position title: ${positionTitle} , Depends on position title give me 3-4 points in json format for my experience in resume in array format`

        const PROMPT = `Position title: ${positionTitle}, Provide 3-4 key experience points in simple language in JSON array format for my resume. and every single point not more than 20 words. point to be in value no key . don't use I in starting use direct words to look like professional every time genrate a new point
        example [
            "Point-1" 
            "Point-2" 
            ....
        ]`;

        try {
            const aiResult = await chatSession.sendMessage(PROMPT);

            if (!aiResult) return null;

            const responseText = aiResult.response.text();
            const cleanedResponse = cleanAiResponse(responseText);

            if (cleanedResponse) {
                form.setValue(`experience.${index}.workSummary`, cleanedResponse?.join('<br />'));
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
        } finally {
            setailoading((prev) => {
                const newState = [...prev];
                newState[index] = false;
                return newState;
            });
        }
    }

    const onsubmit = async (data: FormData) => {
        try {
            setLoading(true);
            if (initialdata?.id) {
                // Update 
                if (isValid) {
                    await updateDoc(doc(db, 'resumes', initialdata?.id), {
                        ...data,
                        updated_at: serverTimestamp(),
                    });

                    toast(toastmessage.title, { description: toastmessage.description });
                    enableNext(true);
                    refreshData();
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Error..", {
                description: 'Something went wrong. Please try again later',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialdata?.experience) {
            form.reset({
                experience: initialdata.experience.map(exp => ({
                    ...exp,
                    startDate: formatDate(exp.startDate),
                    endDate: formatDate(exp.endDate),
                }))
            });

            if (initialdata.experience.length == 0) {
                enableNext(false);
            }
        }
    }, [initialdata, form]);

    return (
        <>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Professional Experience</h2>
                <p>Add Your previous Job experience</p>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)} className="w-full flex flex-col gap-6 mt-5">
                        {fields.map((item, index) => (
                            <div key={item.id} className='grid grid-cols-2 gap-3 border p-3 rounded-lg'>

                                {/* Position Title */}
                                <FormField control={form.control} name={`experience.${index}.title`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position Title</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} className="h-12" placeholder="Enter position title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Company Name */}
                                <FormField control={form.control} name={`experience.${index}.companyName`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} className="h-12" placeholder="Enter company name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* City */}
                                <FormField control={form.control} name={`experience.${index}.city`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} className="h-12" placeholder="Enter city" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* State */}
                                <FormField control={form.control} name={`experience.${index}.state`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} className="h-12" placeholder="Enter state" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Start Date */}
                                <FormField control={form.control} name={`experience.${index}.startDate`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" disabled={loading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* End Date */}
                                <FormField control={form.control} name={`experience.${index}.endDate`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date <span className="text-xs">(Leave Empty if working)</span></FormLabel>
                                        <FormControl>
                                            <Input type="date" disabled={loading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Work Summary */}
                                <FormField control={form.control} name={`experience.${index}.workSummary`} render={({ field }) => (
                                    <FormItem className='col-span-2 mt-3'>
                                        <FormLabel className="flex justify-between">
                                            <span>Work Summary</span>
                                            <Button variant="outline" onClick={() => generateairesponse(index)}
                                                type="button" size="sm" className="border-primary text-primary flex gap-2" disabled={ailoading[index]}>
                                                <BrainIcon className='h-4 w-4' /> {ailoading[index] ? 'Generating..' : 'Generate from AI'}
                                            </Button>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea disabled={loading} className="w-full h-25" placeholder="Enter Work Summary" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <div className="col-span-2 flex justify-end">
                                    <Button variant="outline" onClick={() => remove(index)} className="text-red-500">Remove</Button>
                                </div>
                            </div>
                        ))}

                        <Button variant="outline" onClick={() => append({
                            title: '', companyName: '', city: '', state: '', startDate: '', endDate: '', workSummary: ''
                        })}>+ Add More Experience</Button>

                        <Button type="submit" disabled={isSubmitting || loading}>
                            {loading ? <Loader className="animate-spin" /> : actions}
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </>
    );
}
