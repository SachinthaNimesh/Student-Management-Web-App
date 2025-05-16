export {};

declare global {
    interface Window {
        deviceId?: number;
    }
}

export const getStudentByIdNative = async (): Promise<number | null> => {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            console.error("Timeout: Unable to retrieve deviceId");
            resolve(null); // Fallback to null if deviceId is not set
        }, 10000); // 10-second timeout

        const checkForDeviceId = () => {
            if (window.deviceId) {
                clearTimeout(timeout);
                resolve(window.deviceId);
            } else {
                setTimeout(checkForDeviceId, 500);
            }
        };

        checkForDeviceId();

        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'deviceIdUpdate') {
                clearTimeout(timeout);
                resolve(event.data.deviceId);
                window.removeEventListener('message', handleMessage);
            }
        };

        window.addEventListener('message', handleMessage);
    });
};