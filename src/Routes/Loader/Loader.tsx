import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export default function LoaderPage({className} : {className ?: string}) {
    return (
        <div className={cn('h-screen w-screen flex items-center justify-center bg-transparent z-50',className)}>
            <Loader className="w-10 h-10 min-w-10 min-h-10 animate-spin"/>
        </div>
    )
}
