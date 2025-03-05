import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PublicLayout from './Layout/Public-layout'
import Homepage from './Routes/Main/Homepage'
import AuthLayout from './Layout/Auth-layout'
import SignInPage from './Routes/Authenticated/Sign-In'
import SignUpPage from './Routes/Authenticated/Sign-up'
import ProtectedRoutes from './Routes/Protected/protected-routes'
import ProtectedLayout from './Layout/Protected-layout'
import GeneratePage from './Routes/Protected/Generate-page'
import CreateEditPage from './Routes/Protected/Create-Edit-Page'
import MockLoadPage from './Routes/Protected/Mock-load-page'
import Mockinterviewpage from './Routes/Protected/Mock-interview-page'
import Feedback from './Routes/Protected/Feedback'

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
            path: '/generate',
            element: <ProtectedRoutes>
                <ProtectedLayout />
            </ProtectedRoutes>,
            children: [
                {
                    path: '/generate',
                    element: <GeneratePage />
                },
                {
                    path: ':interviewId',
                    element: <CreateEditPage />
                },
                {
                    path: 'interview/:interviewId',
                    element: <MockLoadPage />
                },
                {
                    path: 'interview/:interviewId/start',
                    element: <Mockinterviewpage />
                },
                {
                    path: 'feedback/:interviewId',
                    element:<Feedback />
                }
            ]
        }
    ])
    return <RouterProvider router={router}></RouterProvider>
}

export default App