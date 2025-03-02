import { FieldValue, Timestamp } from "firebase/firestore"

export interface User {
    id: string
    name: string
    email: string
    imageUrl: string
    created_at: Timestamp | FieldValue
    updated_at: Timestamp | FieldValue
}

export interface Interview {
    id: string
    position: string
    description: string
    experience: number
    userId: string
    techstack: string
    questions: { question: string; answer: string }[]
    created_at: Timestamp
    updated_at: Timestamp
}