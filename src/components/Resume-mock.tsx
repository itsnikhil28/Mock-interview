import { Resume } from "@/types";
import Custombreadcrumb from "./Custom-breadcrumb";
import GenerateHeadings from "./Generate-headings";
import { Separator } from "./ui/separator";
import { ResumeContext } from "@/Context/Resume-context";
import Formsection from "./Form-section";
import Resumepreview from "./Resume-preview";

interface ResumeMockprops {
    initialdata: Resume | null
    refreshData: () => Promise<void>;
}

export default function ResumeMock({ initialdata, refreshData }: ResumeMockprops) {
    const title = initialdata?.resumeTitle ? initialdata?.resumeTitle : "Create a new Resume"

    const breadCrumpPage = initialdata?.resumeTitle ? initialdata?.resumeTitle : "Create"

    return (
        <>
            <Custombreadcrumb breadCrumpPage={breadCrumpPage} breadCrumpItems={[{ label: "Resume", link: '/resume' }]} />

            <div className="mt-4 flex items-center justify-between w-full">
                <GenerateHeadings title={title} issubheading />
            </div>

            <Separator className="my-4" />

            <div className="my-6">
                <ResumeContext.Provider value={{ initialdata:initialdata ?? null }}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                        {/* Form Section  */}
                        <Formsection refreshData={refreshData} />
                        {/* Preview Section  */}
                        <Resumepreview />
                    </div>
                </ResumeContext.Provider>
            </div>
        </>
    )
}
