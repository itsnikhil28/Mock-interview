import { FieldValue, Timestamp } from "firebase/firestore"

export interface User {
    id : string
    name : string
    email : string
    imageUrl : string
    created_at : Timestamp | FieldValue
    updated_at : Timestamp | FieldValue
}