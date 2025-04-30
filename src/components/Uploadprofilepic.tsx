import { db } from "@/config/firebase.config"
import { doc, updateDoc, serverTimestamp } from "firebase/firestore"
import axios from "axios"
import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface UploadPicFormProps {
    userId: string
    onUploadSuccess: (picUrl: string) => void
}

export default function UploadPicForm({ userId, onUploadSuccess }: UploadPicFormProps) {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file.")
            return
        }

        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"]
        if (!validTypes.includes(file.type)) {
            toast.error("Only image files are allowed (JPG, PNG, WEBP, etc).")
            return
        }

        const formData = new FormData()
        formData.append("profilePic", file)

        try {
            setUploading(true)

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/uploadProfilePic`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            const picUrl = res.data.url

            console.log(picUrl)

            await updateDoc(doc(db, "users", userId), {
                pic: picUrl,
                updated_at: serverTimestamp(),
            })

            toast.success("Profile picture uploaded successfully.")
            onUploadSuccess(picUrl)
        } catch (err: any) {
            toast.error("Upload failed: " + err.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="flex-1 mb-2"
            />

            {uploading && (
                <p className="text-blue-600 text-sm mt-2 flex justify-center">
                    <Loader2 className="animate-spin" />
                </p>
            )}

            <Button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-2 px-4 py-2 rounded"
            >
                {uploading ? "Uploading..." : "Upload"}
            </Button>
        </div>
    )
}
