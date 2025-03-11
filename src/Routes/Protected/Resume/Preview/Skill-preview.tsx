import { DetailProps } from "./Personal-detail-preview";


export default function SkillsPreview({ initialdata }: DetailProps) {

    return (
        <div className='my-6'>
            <h2 className='text-center font-bold text-sm mb-2'
                style={{
                    color: initialdata?.themecolor
                }}>Skills</h2>
            <hr style={{
                borderColor: initialdata?.themecolor
            }} />

            <div className='grid grid-cols-2 gap-3 my-4'>
                {initialdata?.skill && initialdata?.skill.map((item, index) => (
                    <div key={index} className='flex items-center justify-between'>
                        <h2 className='text-xs'>{item.name}</h2>
                        <div className='h-2 bg-gray-200 w-[120px]'>
                            <div className='h-2 progress-fill'
                                style={{
                                    background: initialdata?.themecolor || 'blue',
                                    width: item?.rating * 20 + '%',
                                }}
                            >
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
