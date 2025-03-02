import { Toaster } from "@/components/ui/sonner";

export default function ToastProvider() {
    return (
        <Toaster theme="light" richColors position="top-right" className="bg-neutral-100 shadow-lg" />
    )
}
