export const cleanAiResponse = (responseText: string): any[] | null => {
    try {
        // Step 1: Trim surrounding whitespace
        let cleanText = responseText.trim();

        // Step 2: Remove "json" or code block symbols
        cleanText = cleanText.replace(/(json|```|`)/g, "");

        // Step 3: Extract the first JSON array found
        const jsonArrayMatch = cleanText.match(/\[.*\]/s);

        if (!jsonArrayMatch) {
            console.error("cleanAiResponse: No JSON array found in response:", responseText);
            return null;
        }

        cleanText = jsonArrayMatch[0];

        // Step 4: Parse the clean JSON text
        try {
            const parsedJson = JSON.parse(cleanText);

            // Check if it's an array
            if (!Array.isArray(parsedJson)) {
                console.error("cleanAiResponse: Parsed JSON is not an array:", cleanText);
                return null;
            }

            return parsedJson;
        } catch (parseError) {
            console.error("cleanAiResponse: Invalid JSON format:", parseError, cleanText);
            return null;
        }
    } catch (error) {
        console.error("cleanAiResponse: Unexpected error:", error, responseText);
        return null;
    }
};