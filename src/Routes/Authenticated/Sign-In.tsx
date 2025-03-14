import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
    return <div className="h-[100vh] flex items-center justify-center">
        <SignIn signUpUrl='/sign-up' />
    </div>
}
