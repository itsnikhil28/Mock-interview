import { FieldValue, Timestamp } from "firebase/firestore"

export interface User {
    id: string
    name: string
    email: string
    imageUrl: string
    role: "interviewer" | "candidate"
    created_at: Timestamp | FieldValue
    updated_at: Timestamp | FieldValue
}

export interface AiInterview {
    id: string
    position: string
    description: string
    experience: number
    userId: string
    techstack: string
    noofquestions: number
    questions: { question: string; answer: string }[]
    created_at: Timestamp
    updated_at: Timestamp
}

export interface Useranswer {
    id: string
    mockIdRef: string
    question: string
    correct_ans: string
    user_ans: string
    feedback: string
    rating: number
    userId: string
    created_at: Timestamp
    updated_at: Timestamp
}

export interface Resume {
    id: string
    userId : string
    resumeTitle: string
    userEmail: string
    userName: string
    themecolor : string
    created_at: Timestamp
    updated_at: Timestamp

    // resumedetails
    firstName: string
    lastName: string
    jobTitle: string
    address: string
    phone: string
    email: string

    //summary
    summary: string

    //education
    education: {
        universityName: string;
        degree: string;
        major: string;
        startDate: Date;
        endDate: Date;
        description: string;
    }[]

    //experience detail
    experience: {
        title: string
        companyName: string
        city: string
        state: string
        startDate: string | Date
        endDate: string | Date
        workSummary: string
    }[]

    //skill
    skill: {
        name: string
        rating: number
    }[]
}

export interface LiveInterview {
    id: string
    title: string
    description: string
    status : string
    userId: string
    interviewerId : string[]
    streamCallId : string
    startTime: number
    endTime : number
    created_at: Timestamp
    updated_at: Timestamp
}

export interface comments {
    id: string
    content : string
    rating : string
    interviewerId : string    
}