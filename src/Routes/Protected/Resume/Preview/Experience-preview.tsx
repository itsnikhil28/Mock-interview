import { DetailProps } from "./Personal-detail-preview";

export const formatDate = (date: string | Date) =>
    date instanceof Date ? date.toISOString().split("T")[0] : date;

export default function Experiencepreview({ initialdata }: DetailProps) {
    return (
        <div className='my-6'>
            <h2 className='text-center font-bold text-sm mb-2'
                style={{
                    color: initialdata?.themecolor
                }}
            >Professional Experience</h2>
            <hr style={{
                borderColor: initialdata?.themecolor
            }} />

            {initialdata?.experience?.map((item, index) => (
                <div key={index} className='my-5'>
                    <h2 className='text-sm font-bold'
                        style={{
                            color: initialdata?.themecolor
                        }}>{item?.title}</h2>
                    <h2 className='text-xs flex justify-between'>{item?.companyName}, 
                        {" " +item?.city},
                        {" " +item?.state}
                        {item?.startDate && (
                            <span>
                                {formatDate(item?.startDate)} To {item?.endDate ? formatDate(item.endDate) : "Present"}
                            </span>
                        )}
                    </h2>
                    <div className='text-xs my-3 gap-2' dangerouslySetInnerHTML={{ __html: item?.workSummary }} />
                </div>
            ))}
        </div>
    )
}
