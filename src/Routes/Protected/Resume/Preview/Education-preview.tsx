import { formatDate } from "./Experience-preview";
import { DetailProps } from "./Personal-detail-preview";

export default function Educationpreview({ initialdata }: DetailProps) {
    return (
        <div className='my-6'>
            <h2 className='text-center font-bold text-sm mb-2'
                style={{
                    color: initialdata?.themecolor
                }}
            >Education</h2>
            <hr style={{
                borderColor: initialdata?.themecolor
            }} />

            {initialdata?.education && initialdata?.education.map((education, index) => (
                <div key={index} className='my-5'>
                    <h2 className='text-sm font-bold'
                        style={{
                            color: initialdata?.themecolor
                        }}
                    >{education.universityName}</h2>
                    {education?.degree && (
                        <h2 className='text-xs flex justify-between'>{education?.degree} in {education?.major}
                            <span>{formatDate(education?.startDate)} - To {education?.endDate ? formatDate(education.endDate) : "Present"}</span>
                        </h2>
                    )}
                    <p className='text-xs my-2'>
                        {education?.description}
                    </p>
                </div>
            ))}

        </div>
    )
}
