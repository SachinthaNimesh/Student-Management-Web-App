export {};

declare global {
    interface Window {
        bearerToken?: string;
    }
}

// Function to get the bearer token from the window object
export const getBearerToken = (): string | null => {
    if (window.bearerToken) {
        console.log("Bearer token fetched:", window.bearerToken);
        return window.bearerToken;
    } else {
        console.error("Bearer token not found in window object!");
        return null;
    }
};



