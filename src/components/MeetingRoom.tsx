import { CallControls, CallingState, CallParticipantsList, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from "@stream-io/video-react-sdk"
import { LayoutListIcon, LoaderIcon, UsersIcon } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import EndCallButton from "./EndCallButton"
import CodeEditor from "./CodeEditor"

export default function MeetingRoom() {
    const [layout, setlayout] = useState<'speaker' | 'grid'>('speaker')
    const navigate = useNavigate()
    const [showparticipants, setshowparticipants] = useState(false)
    const { useCallCallingState } = useCallStateHooks()

    const callingstate = useCallCallingState()

    if (callingstate !== CallingState.JOINED) {
        <div className="h-[40vh] md:h-[70vh] flex justify-center items-center">
            <LoaderIcon className="w-10 h-10 min-w-10 min-h-10 animate-spin" />
        </div>
    }
    return (
        <div className="h-[80vh] my-8">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={40} minSize={45} maxSize={100} className="relative">
                    {/* VIDEO LAYOUT */}
                    <div className="absolute inset-0">
                        {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

                        {/* PARTICIPANTS LIST OVERLAY */}
                        {showparticipants && (
                            <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                                <CallParticipantsList onClose={() => setshowparticipants(false)} />
                            </div>
                        )}
                    </div>

                    {/* VIDEO CONTROLS */}

                    <div className="absolute bottom-4 left-0 right-0">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 flex-wrap justify-center px-4">
                                <CallControls onLeave={() => navigate("/")} />

                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon" className="size-10">
                                                <LayoutListIcon className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => setlayout("grid")}>
                                                Grid View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setlayout("speaker")}>
                                                Speaker View
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="size-10"
                                        onClick={() => setshowparticipants(!showparticipants)}
                                    >
                                        <UsersIcon className="size-4" />
                                    </Button>

                                    <EndCallButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={60} minSize={25}>
                    <CodeEditor />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
