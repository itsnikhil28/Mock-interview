import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import { CameraIcon, MicIcon, SettingsIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import Custombreadcrumb from "./Custom-breadcrumb"

export default function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
    const [iscameradisabled, setiscameradisabled] = useState(true)
    const [ismicdisabled, setismicdisabled] = useState(true)
    const call = useCall()

    if (!call) return null
    
    const breadCrumpPage = call.id

    useEffect(() => {
        if (iscameradisabled) call.camera.disable()
        else call.camera.enable()

    }, [iscameradisabled, call.camera])

    useEffect(() => {
        if (ismicdisabled) call.microphone.disable()
        else call.microphone.enable()

    }, [iscameradisabled, call.camera])

    const handlejoin = async () => {
        await call.join()
        onSetupComplete()
    }
    return (
        <>
            <Custombreadcrumb breadCrumpPage={breadCrumpPage} breadCrumpItems={[{ label: "Dashboard", link: '/interviewer/dashboard' }]} />
            <div className="my-6 flex justify-center items-center p-6 bg-background/95">
                <div className="w-full max-w-[1200px] mx-auto">
                    <div className="grid grid-col-1 md:grid-cols-2 gap-6">
                        {/* VIDEO PREVIEW CONTAINER */}
                        <Card className="md:col-span-1 p-6 flex flex-col">
                            <div>
                                <h1 className="text-xl font-semibold mb-1">Camera Preview</h1>
                                <p className="text-sm text-muted-foreground">Make sure you look good!</p>
                            </div>

                            {/* VIDEO PREVIEW */}
                            <div className="mt-4 flex-1 min-h-[400px] rounded-xl overflow-hidden bg-muted/50 border relative">
                                <div className="absolute inset-0 flex justify-center items-center">
                                    <VideoPreview className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </Card>

                        {/* CARD CONTROLS */}

                        <Card className="md:col-span-1 p-6">
                            <div className="h-full flex flex-col">
                                {/* MEETING DETAILS  */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-1">Meeting Details</h2>
                                    <p className="text-sm text-muted-foreground break-all">{call.id}</p>
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="spacey-6 mt-8">
                                        {/* CAM CONTROL */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <CameraIcon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Camera</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {iscameradisabled ? "Off" : "On"}
                                                    </p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={!iscameradisabled}
                                                onCheckedChange={(checked) => setiscameradisabled(!checked)}
                                            />
                                        </div>

                                        {/* MIC CONTROL */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <MicIcon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Microphone</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {ismicdisabled ? "Off" : "On"}
                                                    </p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={!ismicdisabled}
                                                onCheckedChange={(checked) => setismicdisabled(!checked)}
                                            />
                                        </div>

                                        {/* DEVICE SETTINGS */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <SettingsIcon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Settings</p>
                                                    <p className="text-sm text-muted-foreground">Configure devices</p>
                                                </div>
                                            </div>
                                            <DeviceSettings />
                                        </div>
                                    </div>

                                    {/* JOIN BTN */}
                                    <div className="space-y-3 mt-8">
                                        <Button className="w-full" size="lg" onClick={handlejoin}>
                                            Join Meeting
                                        </Button>
                                        <p className="text-xs text-center text-muted-foreground">
                                            Do not worry, our team is super friendly! We want you to succeed. 🎉
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}
