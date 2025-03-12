import { createContext, useContext, useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { useAuth } from "@clerk/clerk-react";
import { User } from "@/types";
import { db } from "@/config/firebase.config";

interface UserContextType {
    userData: User | null;
    loading: boolean;
}

// Create the UserContext
const UserContext = createContext<UserContextType | null>(null);

// Create the Provider Component
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { userId } = useAuth();
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            const userDoc = await getDoc(doc(db, "users", userId));

            if (userDoc.exists()) {
                setUserData(userDoc.data() as User);
            } else {
                console.log("User not found");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    return (
        <UserContext.Provider value={{ userData, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom Hook to use UserContext
export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    const { userData } = context;

    return {
        role: userData?.role ?? null,
        userData
    };
};
