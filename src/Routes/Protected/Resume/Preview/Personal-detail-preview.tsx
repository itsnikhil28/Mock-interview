import { Resume } from "@/types";

export interface DetailProps {
    initialdata?: Partial<Resume>; // Use Partial to allow missing properties
}

export default function Personaldetailpreview({initialdata}:DetailProps) {

    return (
        <div>
            <h2 className='font-bold text-xl text-center'
                style={{
                    color: initialdata?.themecolor
                }}
            >
                {initialdata?.firstName || 'Start Entering'} {initialdata?.lastName || 'Details'}</h2>
            <h2 className='text-center text-sm font-medium'
            >{initialdata?.jobTitle}</h2>
            <h2 className='text-center font-normal text-xs'
                style={{
                    color: initialdata?.themecolor
                }}>{initialdata?.address}</h2>

            <div className='flex justify-between'>
                <h2 className='font-normal text-xs'
                    style={{
                        color: initialdata?.themecolor
                    }}>{initialdata?.phone}</h2>
                <h2 className='font-normal text-xs'
                    style={{
                        color: initialdata?.themecolor
                    }}>{initialdata?.email}</h2>

            </div>
            <hr className='border-[1.5px] my-2'
                style={{
                    borderColor: initialdata?.themecolor
                }}
            />
        </div>
    )
}
