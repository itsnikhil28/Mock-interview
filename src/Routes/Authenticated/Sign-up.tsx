import { SignUp } from '@clerk/clerk-react'
import React from 'react'

export default function SignUpPage() {
    return <SignUp signInUrl='/sign-in'/>
}
