import { useAuth } from "@clerk/clerk-react";
import React from "react";
import { Navigate } from "react-router-dom";
import LoaderPage from "../Loader/Loader";

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {

    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
        return <LoaderPage />
    }

    if (!isSignedIn) {
        return <Navigate to={'sign-in'} replace />
    }
    return children
}
