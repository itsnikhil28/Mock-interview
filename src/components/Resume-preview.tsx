import { ResumeContext } from "@/Context/Resume-context"
import Educationpreview from "@/Routes/Protected/Resume/Preview/Education-preview";
import Experiencepreview from "@/Routes/Protected/Resume/Preview/Experience-preview";
import Personaldetailpreview from "@/Routes/Protected/Resume/Preview/Personal-detail-preview";
import SkillsPreview from "@/Routes/Protected/Resume/Preview/Skill-preview";
import Summarypreview from "@/Routes/Protected/Resume/Preview/Summary-preview";
import { Resume } from "@/types";
import { useContext } from "react"

export default function Resumepreview() {
    const context = useContext(ResumeContext);
    const initialdata: Partial<Resume> | undefined = context?.initialdata ?? undefined;

    return (
        <div className='shadow-lg h-max p-14 border-t-[20px] border-b-[20px]'
            style={{
                borderColor: initialdata?.themecolor || 'gray'
            }}>
            {/* Personal Detail  */}
            <Personaldetailpreview initialdata={initialdata} />

            {/* Summary  */}
            <Summarypreview initialdata={initialdata} />

             {/* Professional Experience  */}
            <Experiencepreview initialdata={initialdata} />

            {/* Educational  */}
            {<Educationpreview initialdata={initialdata} />}

            {/* Skills  */}
            <SkillsPreview initialdata={initialdata} />
        </div>
    )
}
