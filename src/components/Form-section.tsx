import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import Personaldetailform from "@/Routes/Protected/Resume/Forms/Personal-detail-form";
import Summaryform from "@/Routes/Protected/Resume/Forms/Summary-form";
import Experienceform from "@/Routes/Protected/Resume/Forms/Experience-form";
import Skillfrom from "@/Routes/Protected/Resume/Forms/Skill-from";
import EducationForm from "@/Routes/Protected/Resume/Forms/Education-form";
import Themecolor from "./Theme-color";

interface FormSectionprops {
    refreshData: () => Promise<void>;
}

export default function Formsection({ refreshData }: FormSectionprops) {
    const [activeFormIndex, setActiveFormIndex] = useState(1);
    const [enableNext, setEnableNext] = useState(true);
    const { resumeId } = useParams()

    return (
        <div>
            <div className='flex justify-between items-center'>
                <div className='flex gap-5'>
                    <Link to={"/"}>
                        <Button><Home /></Button>
                    </Link>
                    <Themecolor refreshData={refreshData} />

                </div>
                <div className='flex gap-2'>
                    {activeFormIndex > 1
                        && <Button size="sm"
                            onClick={() => setActiveFormIndex(activeFormIndex - 1)}> <ArrowLeft /> </Button>}
                    <Button disabled={!enableNext} className="flex gap-2" size="sm"
                        onClick={() => setActiveFormIndex(activeFormIndex + 1)}> Next <ArrowRight /> </Button>
                </div>
            </div>
            {/* Personal Detail  */}
            {activeFormIndex == 1 ? <Personaldetailform refreshData={refreshData} enableNext={(v) => setEnableNext(v)} />
                // Summaryform 
                : activeFormIndex == 2 ? <Summaryform refreshData={refreshData} enableNext={(v) => setEnableNext(v)} />

                    // experienceform
                    : activeFormIndex == 3 ? <Experienceform refreshData={refreshData} enableNext={(v) => setEnableNext(v)} />

                        // educationfrom
                        : activeFormIndex == 4 ? <EducationForm refreshData={refreshData} enableNext={(v) => setEnableNext(v)} />

                            // skillform
                            : activeFormIndex == 5 ? <Skillfrom refreshData={refreshData} enableNext={(v) => setEnableNext(v)} />

                                // view
                                : activeFormIndex == 6 ? <Navigate to={`/resume/${resumeId}/view`} />
                                    : null
            }
        </div>
    )
}
