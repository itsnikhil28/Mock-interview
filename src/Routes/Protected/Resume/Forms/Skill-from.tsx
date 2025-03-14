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
import {Rating} from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

const formschema = z.object({
    skill: z.array(z.object({
        name: z.string().min(1, 'Skill Name is required').max(50, 'Skill Name must be 50 characters or less'),
        rating: z.number().min(1, 'Rating is required')
    }))
});

type FormData = z.infer<typeof formschema>;

export default function Skillform({ enableNext, refreshData }: Formsectionprops) {
    const { initialdata } = useContext(ResumeContext) as resumeprops;

    const form = useForm<FormData>({
        resolver: zodResolver(formschema),
        defaultValues: {
            skill: initialdata?.skill?.map(exp => ({
                name: exp.name || '',
                rating: exp.rating || 0,
            })) || [{
                name: '',
                rating: 0,
            }]
        }

    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "skill",
    });

    const { isValid, isSubmitting } = form.formState;
    const [loading, setLoading] = useState(false);

    const actions = initialdata?.skill?.length !== undefined ? "Update" : "Create";
    const toastmessage = initialdata?.skill?.length !== undefined
        ? { title: "Updated..!", description: "Changes saved Successfully..." }
        : { title: "Created..!", description: "Skills added" };

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
        if (initialdata?.skill) {
            form.reset({
                skill: initialdata.skill.map(exp => ({
                    ...exp
                }))
            });

            if (initialdata.skill?.length === undefined) {
                enableNext(false);
            }
        }
    }, [initialdata, form]);

    return (
        <>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Skills</h2>
                <p>Add Your top professional key skills</p>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)} className="w-full flex flex-col gap-6 mt-5">
                        {fields.map((item, index) => (
                            <div key={item.id} className='grid grid-cols-2 gap-3 border p-3 rounded-lg'>

                                {/* University Name */}
                                < FormField control={form.control} name={`skill.${index}.name`} render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel>Skill Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} className="h-12" placeholder="Enter Skill Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name={`skill.${index}.rating`} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rating</FormLabel>
                                        <FormControl>
                                            <Rating style={{maxWidth:200}} {...field} />
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
                            name: '', rating: 0
                        })}>+ Add More Skill</Button>

                        <Button type="submit" disabled={isSubmitting || loading}>
                            {loading ? <Loader className="animate-spin" /> : actions}
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </>
    );
}

