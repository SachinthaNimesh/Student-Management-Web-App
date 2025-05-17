// src/api.ts
export async function fetchProtectedData() {
    interface CustomWindow extends Window {
        sessionToken?: string;
    }
    const token = (window as CustomWindow).sessionToken;
  
    if (!token) throw new Error("No session token!");
  
    const res = await fetch("http://localhost:8080/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (!res.ok) throw new Error("Auth failed");
    return res.json();
  }
  