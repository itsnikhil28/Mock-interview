import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "./ui/button"
import { LayoutGrid } from "lucide-react"
import { useContext, useState } from "react";
import { ResumeContext } from "@/Context/Resume-context";
import { resumeprops } from "@/Routes/Protected/Resume/Forms/Personal-detail-form";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { toast } from "sonner";

export interface Themesectionprops {
    refreshData: () => Promise<void>;
}

export default function Themecolor({ refreshData }: Themesectionprops) {
    const colors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFA1", "#FF7133", "#71FF33", "#7133FF", "#FF3371", "#33FF71", "#3371FF", "#A1FF33", "#33A1FF", "#FF5733", "#5733FF", "#33FF5A", "#5A33FF", "#FF335A", "#335AFF"
    ]

    const { initialdata } = useContext(ResumeContext) as resumeprops;
    const [selectedColor, setSelectedColor] = useState<string>("");

    const onColorSelect = async (item: string) => {
        if (!initialdata?.id) {
            toast.error("Invalid document ID!");
            return;
        }
        
        try {
            setSelectedColor(item); 

            await updateDoc(doc(db, 'resumes', initialdata?.id), {
                themecolor: item,
                updated_at: serverTimestamp(),
            });

            toast.success('Theme changed!');
            refreshData();
        } catch (error) {
            console.error("Error updating theme:", error);
            toast.error("Failed to change theme!");
        }
    }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} size={"sm"} className="flex gap-2">
                        <LayoutGrid /> Theme
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <h2 className='mb-2 text-sm font-bold'>Select Theme Color</h2>
                    <div className='grid grid-cols-5 gap-3'>
                        {colors.map((item, index) => (
                            <div key={index} onClick={() => onColorSelect(item)}
                                className={`h-5 w-5 rounded-full cursor-pointer hover:border-black border ${selectedColor == item && 'border border-black'} `}
                                style={{
                                    background: item
                                }}>
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </>
    )
}
