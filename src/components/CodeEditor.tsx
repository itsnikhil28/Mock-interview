import { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon, Loader2Icon, XIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import { LANGUAGES } from "@/lib/helper";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import { cleanAiResponse } from "./clean-airesponse";
import { useUser } from "@/provider/User-Provider";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { useNavigate, useParams } from "react-router-dom";
import { MeetingQuestions } from "@/types";

interface AIResponse {
    id: string;
    title: string;
    description: string;
    examples: {
        input: string;
        output: string;
        explanation?: string;
    }[];
    starterCode: {
        [key: string]: string;
    };
    constraints: string[];
    languages: string[];
}

function CodeEditor() {
    const [formData, setFormData] = useState<{ noofquestion: string; languages: string[] }>({
        noofquestion: "",
        languages: [],
    });

    const { meetingId } = useParams()
    const [loading, setloading] = useState(false)
    const [airesult, setairesult] = useState<AIResponse[] | null>(null)
    const [selectedQuestion, setSelectedQuestion] = useState<AIResponse | null>(null);
    const [language, setLanguage] = useState<string | null>(null);
    const [languagefromdb, setLanguagefromdb] = useState<any[] | null>([]);
    const [code, setCode] = useState<string>("");
    const [showquestion, setshowquestion] = useState(false)
    const [isDataAvailable, setIsDataAvailable] = useState(false);
    const { role } = useUser()
    const navigate = useNavigate()

    const addlanguage = (langid: string) => {
        if (!formData.languages.includes(langid)) {
            setFormData((prev) => ({
                ...prev,
                languages: [...prev.languages, langid],
            }));
        }
    };

    const removelanguage = (langid: string) => {
        setFormData((prev) => ({
            ...prev,
            languages: prev.languages.filter((id) => id !== langid),
        }));
    };

    const generatequestions = async () => {
        setloading(true)
        const { noofquestion, languages } = formData

        if (noofquestion.trim() === "") {
            toast.error("Please Enter No of Question");
            setloading(false)
            return
        }
        if (languages.length === 0) {
            toast.error("Please select a language");
            setloading(false)
            return;
        }

        const airesult = await generateresult(noofquestion, languages.join(", "));

        if (airesult.length > 0) {
            setairesult(airesult)
            try {
                await addDoc(collection(db, "meeting_questions"), {
                    questions: airesult,
                    streamCallId: meetingId,
                    selectedlanguages,
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp(),
                });

                toast.success("Questions Generated successfully.");
                handleshowquestion()
            } catch (error) {
                console.error("Error saving questions: ", error);
                toast.error("Could not save questions.");
                setIsDataAvailable(false)
            }
        } else {
            toast.error("Could not generate Question.. Try again")
            setIsDataAvailable(false)
        }
        setshowquestion(true)
    }

    const generateresult = async (noofquestion: string, languages: string): Promise<AIResponse[]> => {
        setloading(true)
        const prompt = `Generate ${noofquestion} unique coding questions in strict JSON format only. Each question must cover different problem-solving concepts like arrays, strings, recursion, searching, sorting, dynamic programming, etc.

            Return only valid JSON. Do not include any explanation, comments, or markdown formatting. The response must be a raw JSON array of objects, like this:

            [
            {
                "id": "unique-question-id",
                "title": "Question Title",
                "description": "A clear and detailed problem statement explaining what needs to be solved.",
                "examples": [
                {
                    "input": "Example input",
                    "output": "Expected output",
                    "explanation": "Explanation of how the output is derived (if necessary)."
                },
                {
                    "input": "Another input",
                    "output": "Another output",
                    "explanation": "Explanation for the second example."
                }
                ],
                "starterCode": {
                "javascript": "function exampleFunction() {\n  // Implement your solution here\n}",
                "python": "def example_function():\n  # Implement your solution here\n  pass",
                "java": "class Solution {\n  public void exampleFunction() {\n    // Implement your solution here\n  }\n}"
                },
                "constraints": [
                "Constraint 1",
                "Constraint 2"
                ],
                "languages": ["${languages}"]
            }
            ]

            Requirements:
            1. Questions must include a mix of easy, medium, and hard difficulty.
            2. Each question must contain exactly two examples.
            3. Use only the programming languages specified: ${languages}.
            4. Do not include markdown, explanations, or anything else outside the JSON array.
            `;
        try {
            const airesult = await chatSession.sendMessage(prompt)

            const rawResult = cleanAiResponse(airesult.response.text());

            if (Array.isArray(rawResult) && rawResult.length > 0) {
                return rawResult.map((item: any) => ({
                    id: item.id ?? "",
                    title: item.title ?? "",
                    description: item.description ?? "",
                    examples: Array.isArray(item.examples) ? item.examples : [],
                    starterCode: typeof item.starterCode === "object" ? item.starterCode : {},
                    constraints: Array.isArray(item.constraints) ? item.constraints : []
                })) as AIResponse[];
            } else {
                setIsDataAvailable(false)
                return [] as AIResponse[];
            }
        } catch (error) {
            console.log(error);
            toast("Error", {
                description: "An error occurred while generating questions."
            })
            setIsDataAvailable(false)
            return [] as AIResponse[];
        } finally {
            setloading(false)
        }
    }

    const handleQuestionChange = (questionId: string) => {
        if (airesult && airesult.length > 0) {
            const question = airesult.find((q) => q.id === questionId);
            if (question && question.starterCode && Object.keys(question.starterCode).length > 0) {
                const firstLang = Object.keys(question.starterCode)[0];
                setSelectedQuestion(question);
                setLanguage(firstLang);
                setCode(question.starterCode[firstLang] || "");
            }
        }
    };

    const handleLanguageChange = (newLanguage: string) => {
        if (selectedQuestion && selectedQuestion.starterCode && selectedQuestion.starterCode[newLanguage]) {
            setLanguage(newLanguage);
            setCode(selectedQuestion.starterCode[newLanguage]);
        }
    };

    const handleshowquestion = async () => {
        setloading(true)
        try {
            const q = query(collection(db, "meeting_questions"), where("streamCallId", "==", meetingId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const firstRecord = querySnapshot.docs[0].data() as MeetingQuestions

                setLanguagefromdb(firstRecord.selectedlanguages)

                setshowquestion(true)
                setairesult(firstRecord.questions)
                setIsDataAvailable(true)
            } else {
                toast.info("No questions have been generated by the interviewer. Please wait for the interviewer to generate the question...")
                setIsDataAvailable(false)
            }
        } catch (error) {
            console.log("Something went wrong..", error)
            toast.error("Something Went Wrong... please try again later..")
        } finally {
            setloading(false)
        }
    }

    const checkIfDataExists = async (meetingId: string) => {
        try {
            const q = query(collection(db, "meeting_questions"), where("streamCallId", "==", meetingId))
            const querySnapshot = await getDocs(q)
            setIsDataAvailable(!querySnapshot.empty)

            if (!querySnapshot.empty) {
                const firstRecord = querySnapshot.docs[0].data() as MeetingQuestions

                setLanguagefromdb(firstRecord.selectedlanguages)

                // setshowquestion(true)
                setairesult(firstRecord.questions)
            }
        } catch (error) {
            console.log("Error checking data:", error)
            setIsDataAvailable(false)
            toast.error("Something went wrong while fetching data...")
        }
    };

    useEffect(() => {
        if (meetingId) {
            checkIfDataExists(meetingId);
        } else {
            toast.error('Meeting Id not set...')
            navigate('/')
        }
    }, [meetingId]);

    const selectedlanguages = LANGUAGES.filter((i) =>
        formData.languages.includes(i.id)
    );

    useEffect(() => {
        if (airesult && airesult.length > 0) {
            const firstQuestion = airesult[0];
            const firstLanguage = Object.keys(firstQuestion.starterCode)[0];
            setSelectedQuestion(firstQuestion);
            setLanguage(firstLanguage);
            setCode(firstQuestion.starterCode[firstLanguage]);
        }
    }, [airesult]);

    return (
        <>
            {role === 'interviewer' && !isDataAvailable && !showquestion && (
                <>
                    <h2 className="text-xl font-semibold ps-4">Generate Question from AI</h2>
                    <div className="px-5 py-2">
                        <Input placeholder="Enter No of question" value={formData.noofquestion} onChange={(e) => setFormData({ ...formData, noofquestion: e.target.value })} />
                        {/* INTERVIEWERS */}
                        <div className="space-y-4 mt-5">
                            <label className="text-[15px] font-medium">Languages</label>
                            <div className="flex flex-wrap">
                                {selectedlanguages.map((lang) => (
                                    <div
                                        key={lang.id}
                                        className="inline-flex items-center gap-2 bg-secondary px-2 py-1 mr-2 mb-2 rounded-md text-sm"
                                    >
                                        {lang.name}
                                        <button
                                            onClick={() => removelanguage(lang.id)}
                                            className="hover:text-destructive transition-colors"
                                        >
                                            <XIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {LANGUAGES.length > 0 && (
                                <Select onValueChange={addlanguage}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Add Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LANGUAGES.map((lang) => (
                                            <SelectItem key={lang.id} value={lang.id}>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={`/assets/img/${lang.id}.png`}
                                                        alt={lang.id}
                                                        className="w-5 h-5 object-contain"
                                                    />
                                                    {lang.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        <Button onClick={generatequestions} disabled={loading} className="mt-4">
                            {loading ? (
                                <>
                                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Generate"
                            )}
                        </Button>
                    </div>
                </>
            )}

            {role === 'candidate' && !showquestion && (
                <div className="flex justify-center items-center h-[70vh]">
                    <Button onClick={handleshowquestion} disabled={loading}> {loading ? <> <Loader2Icon className="animate-spin size-6" /> "Showing Questions" </> : "Show Question"}</Button>
                </div>
            )}

            {(role === 'interviewer' && isDataAvailable) || (role === 'candidate' && showquestion && isDataAvailable) ? (Array.isArray(airesult) && airesult.length > 0 && (
                <ResizablePanelGroup direction="vertical" className="h-[80vh] w-full max-w-full">

                    <ResizablePanel className="w-full">
                        <ScrollArea className="h-full w-full min-w-auto">
                            <div className="p-6">
                                <div className="w-auto mx-auto space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-2xl font-semibold tracking-tight">
                                                    {selectedQuestion?.title}
                                                </h2>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Choose your language and solve the problem
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Select value={selectedQuestion?.id} onValueChange={handleQuestionChange}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select question" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {airesult.map((q) => (
                                                        <SelectItem key={q.id} value={q.id}>
                                                            {q.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {language && (<Select value={language} onValueChange={handleLanguageChange}>
                                                <SelectTrigger className="w-[150px]">
                                                    <SelectValue>
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={`/assets/img/${language}.png`}
                                                                alt={language}
                                                                className="w-5 h-5 object-contain"
                                                            />
                                                            {
                                                                (selectedlanguages.length > 0 && selectedlanguages.find((l) => l.id === language)?.name) ||
                                                                (Array.isArray(languagefromdb) && languagefromdb.length > 0 && (languagefromdb.find((l: any) => l.id === language) as { name: string })?.name) ||
                                                                "Select Language"
                                                            }
                                                            {/* {selectedlanguages.find((l) => l.id === language)?.name} */}
                                                        </div>
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(languagefromdb && languagefromdb.length > 0 ? languagefromdb : selectedlanguages).map((lang) => (
                                                        <SelectItem key={(lang as { id: string; name: string }).id} value={(lang as { id: string; name: string }).id}>
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={`/assets/img/${(lang as { id: string; name: string }).id}.png`}
                                                                    alt={(lang as { id: string; name: string }).name}
                                                                    className="w-5 h-5 object-contain"
                                                                />
                                                                {(lang as { id: string; name: string }).name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            )}
                                        </div>
                                    </div>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center gap-2">
                                            <BookIcon className="h-5 w-5 text-primary/80" />
                                            <CardTitle>Problem Description</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm leading-relaxed">
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                <p className="whitespace-pre-line">{selectedQuestion?.description}</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center gap-2">
                                            <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                                            <CardTitle>Examples</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ScrollArea className="h-full w-full rounded-md border">
                                                <div className="p-4 space-y-4">
                                                    {selectedQuestion?.examples.map((example, index) => (
                                                        <div key={index} className="space-y-2">
                                                            <p className="font-medium text-sm">Example {index + 1}:</p>
                                                            <ScrollArea className="h-full w-full rounded-md">
                                                                <pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono w-full">
                                                                    <div>
                                                                        Input: {typeof example.input === "string" ? example.input : JSON.stringify(example.input)}
                                                                    </div>
                                                                    <div>
                                                                        Output: {typeof example.output === "string" ? example.output : JSON.stringify(example.output)}
                                                                    </div>
                                                                    {example.explanation && (
                                                                        <div className="pt-2 text-muted-foreground">
                                                                            Explanation: {example.explanation}
                                                                        </div>
                                                                    )}
                                                                </pre>
                                                                <ScrollBar orientation="horizontal" />
                                                            </ScrollArea>
                                                        </div>
                                                    ))}
                                                </div>
                                                <ScrollBar />
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>

                                    {selectedQuestion?.constraints && (
                                        <Card>
                                            <CardHeader className="flex flex-row items-center gap-2">
                                                <AlertCircleIcon className="h-5 w-5 text-blue-500" />
                                                <CardTitle>Constraints</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                                                    {selectedQuestion.constraints.map((constraint, index) => (
                                                        <li key={index} className="text-muted-foreground">
                                                            {constraint}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                            <ScrollBar />
                        </ScrollArea>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={60} maxSize={100} className="w-full overflow-hidden">
                        <div className="h-full relative">
                            <Editor
                                height={"100%"}
                                width={"100%"}
                                defaultLanguage={language ?? ""}
                                language={language ?? ""}
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 18,
                                    lineNumbers: "on",
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 16, bottom: 16 },
                                    wordWrap: "on",
                                    wrappingIndent: "indent",
                                }}
                            />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            )) : null}
        </>
    );
}
export default CodeEditor;