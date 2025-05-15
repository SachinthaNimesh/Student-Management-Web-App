export const API_URL =
  "https://87e89eab-95e5-4c0f-8192-7ee0196e1581-dev.e1-us-east-azure.choreoapis.dev/employee-mgmt-system/student-mgmt-server/v1.0";
export const REACT_APP_URL =
  "https://87abc270-1269-4d98-8dad-e53781a1ae52.e1-us-east-azure.choreoapps.dev";

declare global {
  interface Window {
    config: {
      GOOGLE_API_KEY: string;
    };
  }
}

export const GOOGLE_API_KEY = window.config?.GOOGLE_API_KEY;
