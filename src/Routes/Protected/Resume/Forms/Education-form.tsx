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
import { Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "../Preview/Experience-preview";

const formschema = z.object({
    education: z.array(z.object({
        universityName: z.string().min(1, 'University Name is required').max(100, 'University Name must be 100 characters or less'),
        degree: z.string().min(1, 'Degree is required').max(100, 'Degree must be 100 characters or less'),
        major: z.string().min(1, 'Major is required').max(100, 'Major must be 100 characters or less'),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string(),
        description: z.string().min(1, "Description is required"),
    }))
});

type FormData = z.infer<typeof formschema>;

export default function EducationForm({ enableNext, refreshData }: Formsectionprops) {
    const { initialdata } = useContext(ResumeContext) as resumeprops;

    const form = useForm<FormData>({
        resolver: zodResolver(formschema),
        defaultValues: {
            education: initialdata?.education?.map(exp => ({
                universityName: exp.universityName || '',
                degree: exp.degree || '',
                major: exp.major || '',
                startDate: formatDate(exp.startDate) || '',
                endDate: formatDate(exp.endDate) || '',
                description: exp.description || '',
            })) || [{
                universityName: '',
                degree: '',
                major: '',
                startDate: '',
                endDate: '',
                description: '',
            }]
        }

    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "education",
    });

    const { isValid, isSubmitting } = form.formState;
    const [loading, setLoading] = useState(false);

    const actions = initialdata?.education?.length !== undefined ? "Update" : "Create";
    const toastmessage = initialdata?.education?.length !== undefined 
        ? { title: "Updated..!", description: "Changes saved Successfully..." }
        : { title: "Created..!", description: "Education details added" };

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
        if (initialdata?.education) {
            form.reset({
                education: initialdata.education.map(exp => ({
                    ...exp,
                    startDate: formatDate(exp.startDate),
                    endDate: formatDate(exp.endDate),
                }))
            });

            if (initialdata.education?.length === undefined) {
                enableNext(false);
            }
        }
    }, [initialdata, form]);

    return (
        <>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Education</h2>
                <p>Add Your educational details</p>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)} className="w-full flex flex-col gap-6 mt-5">
                        {fields.map((item, index) => (
                            <div key={item.id} className='grid grid-cols-2 gap-3 border p-3 rounded-lg'>

                                {/* University Name */}
                                < FormField control={form.control} name={`education.${index}.universityName`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>University Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} className="h-12" placeholder="Enter University Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Degree */}
                                <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Degree Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} className="h-12" placeholder="Degree eg:- Masters" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Major */}
                                <FormField control={form.control} name={`education.${index}.major`} render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Major</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} className="h-12" placeholder="Major eg:- Computer Science" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Start Date */}
                                <FormField control={form.control} name={`education.${index}.startDate`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" disabled={loading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* End Date */}
                                <FormField control={form.control} name={`education.${index}.endDate`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date <span className="text-xs">(Leave Empty if not completed)</span></FormLabel>
                                        <FormControl>
                                            <Input type="date" disabled={loading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {/* Description */}
                                <FormField control={form.control} name={`education.${index}.description`} render={({ field }) => (
                                    <FormItem className='col-span-2'>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea disabled={loading} className="w-full h-25" placeholder="Enter Description" {...field} />
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
                            universityName: '', degree: '', major: '', startDate: '', endDate: '', description: ''
                        })}>+ Add More Education fields</Button>

                        <Button type="submit" disabled={isSubmitting || loading || !isValid}>
                            {loading ? <Loader className="animate-spin" /> : actions}
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </>
    );
}
