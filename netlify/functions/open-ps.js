// Netlify function for open-ps endpoint
// ⚠️ IMPORTANT: PowerShell commands cannot run on Netlify (Linux-based)
// This function handles the request but PowerShell execution requires a Windows backend

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ok: false, error: "Method not allowed" }),
      };
    }

    console.log("open-ps endpoint called on Netlify");

    // ⚠️ PowerShell cannot run on Netlify's Linux servers
    // To run PowerShell commands, you need a Windows-based backend server
    // Set REACT_APP_API_URL in Netlify environment variables to point to your Windows backend
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ok: false,
        message: "PowerShell commands cannot run on Netlify (Linux-based). Please use a Windows-based backend server.",
        note: "Set REACT_APP_API_URL in Netlify environment variables to point to your Windows backend server URL.",
      }),
    };
  } catch (error) {
    console.error("Error in open-ps function:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ok: false, error: error.message }),
    };
  }
}

