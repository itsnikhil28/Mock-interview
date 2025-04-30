import { CallControls, CallingState, CallParticipantsList, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from "@stream-io/video-react-sdk"
import { LayoutListIcon, Lightbulb, LoaderIcon, UsersIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import EndCallButton from "./EndCallButton"
import CodeEditor from "./CodeEditor"
import { LiveInterview } from "@/types"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/config/firebase.config"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { useUser } from "@/provider/User-Provider"

export default function MeetingRoom({ meetingData }: { meetingData: LiveInterview }) {
    const [layout, setlayout] = useState<'speaker' | 'grid'>('speaker')
    const navigate = useNavigate()
    const [showparticipants, setshowparticipants] = useState(false)
    const { useCallCallingState } = useCallStateHooks()
    const [userDetails, setUserDetails] = useState<any>(null)
    const { role } = useUser()

    const callingstate = useCallCallingState()

    const getuserdetails = async () => {
        const querySnapshot = await getDocs(query(collection(db, "users"), where("id", "==", meetingData.userId)));
        const userData = querySnapshot.docs[0].data();
        setUserDetails(userData);
    }

    useEffect(() => {
        getuserdetails()
    }, [meetingData])

    if (callingstate !== CallingState.JOINED) {
        <div className="h-[40vh] md:h-[70vh] flex justify-center items-center">
            <LoaderIcon className="w-10 h-10 min-w-10 min-h-10 animate-spin" />
        </div>
    }
    return (
        <>
            {userDetails && (
                <div className="flex flex-row gap-3 mx-auto">
                    {/* Left: Card with user details */}
                    <Card className="w-full max-w-md p-4">
                        <CardContent className="flex flex-row items-start space-x-6">
                            <img
                                src={userDetails.pic}
                                alt={userDetails.name}
                                className="w-[150px] h-[150px] object-cover rounded-none"
                            />
                            <div className="flex flex-col justify-start space-y-2">
                                <h2 className="text-2xl font-semibold underline">Candidate Details</h2>
                                <h2 className="text-xl">{userDetails.name}</h2>
                                <p className="text-muted-foreground">{userDetails.email}</p>
                                <Badge
                                    variant="outline"
                                    className={`mt-2 border-green-500 text-green-600`}
                                >
                                    {userDetails.role.charAt(0).toUpperCase() + userDetails.role.slice(1)}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Alert className="bg-yellow-100/50 border-yellow-200 p-2 rounded-lg flex items-start gap-3 w-full">
                        <Lightbulb className="h-5 w-5 text-yellow-600 mt-1" />
                        <div>
                            <AlertTitle className="text-yellow-800 font-semibold">
                                Important Information
                            </AlertTitle>
                            <AlertDescription className="text-sm text-yellow-700 mt-1 space-y-1">
                                <ul className="list-disc list-inside">
                                    {role === 'interviewer' ? <li>Verify <span className="font-bold">User</span> name and Image are correct.</li> : <li>Verify your details are properly loaded and correct.</li>}
                                    <li>Scroll down to begin the interview.</li>
                                    <li>You can close the profile card anytime by clicking on the <span className="font-bold">Button given below</span>.</li>
                                    <li>Ensure your webcam and mic are working properly.</li>
                                </ul>
                                <div className="mt-2 font-medium">
                                    <Button size={"sm"} onClick={() => setUserDetails(null)}>Close</Button>
                                </div>
                            </AlertDescription>
                        </div>
                    </Alert>
                </div>
            )}
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
        </>
    )
}
