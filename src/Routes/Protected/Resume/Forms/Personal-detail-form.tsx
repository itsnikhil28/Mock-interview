import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resume } from "@/types";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { ResumeContext } from "@/Context/Resume-context";

export interface Formsectionprops {
    enableNext: (value: boolean) => void;
    refreshData: () => Promise<void>;
}

export interface resumeprops {
    initialdata: Partial<Resume>
}

const formschema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100, 'First name must be 100 characters or less'),
    lastName: z.string().min(1, 'Last name is required').max(100, 'Last name must be 100 characters or less'),
    jobTitle: z.string().min(1, "Job title is required").max(100, "Job title must be 100 characters or less"),
    address: z.string().min(1, "Address is required").max(200, "Address must be 200 characters or less"),
    phone: z.string().regex(/^\d{10}$/, "Phone Number should be exactly 10 digits"),
    email: z.string().email()
})

type FormData = z.infer<typeof formschema>


export default function Personaldetailform({ enableNext,refreshData }:Formsectionprops) {
    const { initialdata } = useContext(ResumeContext) as resumeprops;

    const form = useForm<FormData>({
        resolver: zodResolver(formschema),
        defaultValues: initialdata || {}
    })

    const { isValid, isSubmitting } = form.formState
    const [loading, setloading] = useState(false)
    const actions = initialdata?.firstName ? "Update" : "Create"
    const toastmessage = initialdata?.firstName ? { title: "Updated..!", description: "Changes saved Successfully..." } : { title: "Created..!", description: "Personal detailed added" }

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

                    toast(toastmessage.title, { description: toastmessage.description })
                    enableNext(true)
                    refreshData()
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
                firstName: initialdata.firstName,
                lastName: initialdata.lastName,
                jobTitle: initialdata.jobTitle,
                address: initialdata.address,
                phone: initialdata.phone,
                email: initialdata.email,
            })

            if (!initialdata?.firstName) {
                enableNext(false)
            }
        }
    }, [initialdata, form])
    return (
        <>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Personal Detail</h2>
                <p>Get Started with the basic information</p>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)} className="w-full p-2 my-3 rounded-lg flex flex-col items-start justify-start gap-6 ">
                        {/* position  */}
                        <FormField control={form.control} name="firstName" render={({ field }) => (
                            <FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>First Name</FormLabel>
                                </div>
                                <FormMessage className="text-sm" />
                                <FormControl>
                                    <Input disabled={loading} className="h-12" placeholder="Enter first name" {...field} value={field.value || ""} />
                                </FormControl>
                            </FormItem>
                        )} />

                        {/* description  */}
                        <FormField control={form.control} name="lastName" render={({ field }) => (
                            <FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>Last Name</FormLabel>
                                </div>
                                <FormMessage className="text-sm" />
                                <FormControl>
                                    <Input disabled={loading} className="h-12" placeholder="Enter last name" {...field} value={field.value || ""} />
                                </FormControl>
                            </FormItem>
                        )} />

                        {/* experience  */}
                        <FormField control={form.control} name="jobTitle" render={({ field }) => (
                            <FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>Job Title</FormLabel>
                                </div>
                                <FormMessage className="text-sm" />
                                <FormControl>
                                    <Input disabled={loading} className="h-12" placeholder="Enter job Title" {...field} value={field.value || ""} />
                                </FormControl>
                            </FormItem>
                        )} />

                        {/* techstack  */}
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>Address</FormLabel>
                                </div>
                                <FormMessage className="text-sm" />
                                <FormControl>
                                    <Input disabled={loading} className="h-12" placeholder="Enter address" {...field} value={field.value || ""} />
                                </FormControl>
                            </FormItem>
                        )} />

                        {/* noofquestions  */}
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>Phone Number</FormLabel>
                                </div>
                                <FormMessage className="text-sm" />
                                <FormControl>
                                    <Input type="number" disabled={loading} min={10} className="h-12" placeholder="Enter phone number" {...field} value={field.value || ""} />
                                </FormControl>
                            </FormItem>
                        )} />

                        {/* noofquestions  */}
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem className="w-full space-y-4">
                                <div className="w-full flex items-center justify-between">
                                    <FormLabel>Email</FormLabel>
                                </div>
                                <FormMessage className="text-sm" />
                                <FormControl>
                                    <Input type="email" disabled={loading} className="h-12" placeholder="Enter your email" {...field} value={field.value || ""} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <div className="w-full flex items-center justify-end gap-6">
                            <Button type="submit" size={"sm"} disabled={isSubmitting || loading || !isValid}>{loading ? (<Loader className="text-gray-50 animate-spin" />) : (actions)}</Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </>
    )
}
