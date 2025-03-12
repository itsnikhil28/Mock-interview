import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@/provider/User-Provider";

export default function CheckRole({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
    const { role } = useUser();

    if (role) {
        if (!allowedRoles.includes(role)) {
            toast.error("Access Denied");
            return <Navigate to={'/'} />;
        }
    }

    return children;
}
