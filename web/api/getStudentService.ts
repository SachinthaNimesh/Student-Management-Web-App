export {};

declare global {
    interface Window {
        deviceId?: number;
    }
}

export const getStudentByIdNative = async (): Promise<number | null> => {
    return new Promise((resolve) => {
        // Function to check for deviceId
        const checkForDeviceId = () => {
            if (window.deviceId) {
                resolve(window.deviceId);
            } else {
                setTimeout(checkForDeviceId, 500);
            }
        };

        // Start checking for deviceId
        checkForDeviceId();

        // Set up a listener for future deviceId updates
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'deviceIdUpdate') {
                resolve(event.data.deviceId);
                window.removeEventListener('message', handleMessage);
            }
        };

        window.addEventListener('message', handleMessage);
    });
};
