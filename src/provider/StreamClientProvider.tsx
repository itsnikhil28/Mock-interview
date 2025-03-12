import { useEffect, useState } from "react"
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useAuth, useUser } from "@clerk/clerk-react";
import LoaderPage from "@/Routes/Loader/Loader";
import { streamTokenProvider } from "@/actions/stream.action";

export default function StreamClientProvider({ children }: { children :  React.ReactNode }) {
    const [streamvideoclient, setstreamvideoclient] = useState<StreamVideoClient | null>(null)
    const { user, isLoaded } = useUser()
    const {userId} = useAuth()

    useEffect(() => {
        if (!isLoaded || !user || !userId) return

        const client = StreamVideoClient.getOrCreateInstance({
            apiKey: import.meta.env.VITE_STREAM_API_KEY!,
            user: {
                id: user?.id,
                name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.id,
                image: user?.imageUrl
            },
            tokenProvider: () => streamTokenProvider(userId),
        })

        setstreamvideoclient(client)
    }, [user, isLoaded])

    if (!streamvideoclient) return <LoaderPage />
    return (
        <StreamVideo client={streamvideoclient}>
            {children}
        </StreamVideo>
    )
}
