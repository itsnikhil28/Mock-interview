import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
    return (
        <div className="h-[130vh] flex items-center justify-center">
            <SignUp signInUrl='/sign-in' />
        </div>
    )
}
