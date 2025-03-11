import { DetailProps } from "./Personal-detail-preview";

export default function Summarypreview({ initialdata }: DetailProps) {

    return (
        <p className='text-xs'>
            {initialdata?.summary}
        </p>
    )
}
