export const streamTokenProvider = async (userId: string) => {

    if (!userId) {
        throw new Error("User Not authenticated");
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/getStreamToken`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            console.log("Failed to fetch stream token");
            return
        }

        const { token } = await response.json();
        return token;
    } catch (error) {
        console.error("Error fetching stream token:", error);
        throw error;
    }
}