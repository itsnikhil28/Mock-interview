import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PublicLayout from './Layout/Public-layout'
import Homepage from './Routes/Main/Homepage'
import AuthLayout from './Layout/Auth-layout'
import SignInPage from './Routes/Authenticated/Sign-In'
import SignUpPage from './Routes/Authenticated/Sign-up'
import ProtectedRoutes from './Routes/Protected/protected-routes'
import ProtectedLayout from './Layout/Protected-layout'

function App() {
    const router = createBrowserRouter([
        {
            // public route 
            path: '/',
            element: <PublicLayout />,
            children: [
                {
                    path: '/',
                    element: <Homepage />
                }
            ]
        },
        {
            path: '/',
            element: <AuthLayout />,
            children: [
                {
                    path: '/sign-in/*',
                    element: <SignInPage />
                },
                {
                    path: '/sign-up/*',
                    element: <SignUpPage />
                }
            ]
        },
        {
            path: '/',
            element: <ProtectedRoutes>
                <ProtectedLayout />
            </ProtectedRoutes>
        }
    ])
    return <RouterProvider router={router}></RouterProvider>
}

export default App