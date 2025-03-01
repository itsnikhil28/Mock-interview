import { SignIn } from '@clerk/clerk-react'
import React from 'react'

export default function SignInPage() {
    return <SignIn signUpUrl='/sign-up'  />
}
