document.addEventListener('DOMContentLoaded', function() {
    console.log("Scholar AI initialized with Azure API integration");
    
    // This is a helper function to format API responses with proper styling
    window.formatAIResponse = function(text) {
        if (!text) return "";
        
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    };
    
    // Update API testing function with better error handling
    window.testAPI = async function() {
        try {
            const functionUrl = `https://scholarai.azurewebsites.net/api/claudeChat`;

            const response = await fetch(functionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: "Hello, this is a test message." })
            });

            console.log("API Test - Status:", response.status);
            console.log("API Test - Status Text:", response.statusText);
            console.log("API Test - Headers:", [...response.headers.entries()]);

            // Check if response was successful
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Test - Error response:", errorText || "(empty error response)");
                return {
                    success: false,
                    status: response.status,
                    error: `HTTP error ${response.status}: ${errorText || "No response text"}`
                };
            }
            
            // Try to parse the response as JSON
            try {
                const contentType = response.headers.get('content-type') || '';
                
                if (contentType.includes('application/json')) {
                    const data = await response.json();
                    console.log("API Test - JSON Response:", data);
                    return {
                        success: true,
                        status: response.status,
                        data: data
                    };
                } else {
                    // Handle non-JSON responses
                    const textData = await response.text();
                    console.log("API Test - Text Response:", textData);
                    return {
                        success: true,
                        status: response.status,
                        data: textData,
                        note: "Response was not JSON"
                    };
                }
            } catch (parseError) {
                // Handle parsing errors
                console.error("API Test - Parse error:", parseError);
                const rawText = await response.text();
                console.log("API Test - Raw response:", rawText);
                return {
                    success: false,
                    status: response.status,
                    error: "Failed to parse response: " + parseError.message,
                    rawResponse: rawText
                };
            }
        } catch (error) {
            console.error("API Test - Network error:", error);
            return {
                success: false,
                error: error.message
            };
        }
    };
    
    // Add diagnostics button for deeper troubleshooting
    const aiMain = document.querySelector('.ai-main');
    if (aiMain) {
        const diagButton = document.createElement('button');
        diagButton.textContent = 'Run Diagnostics';
        diagButton.style.position = 'absolute';
        diagButton.style.right = '10px';
        diagButton.style.bottom = '10px';
        diagButton.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
        diagButton.style.color = '#ffd700';
        diagButton.style.border = '1px solid #ffd700';
        diagButton.style.borderRadius = '4px';
        diagButton.style.padding = '5px 10px';
        diagButton.style.cursor = 'pointer';
        diagButton.style.zIndex = '100';
        
        diagButton.onclick = async function() {
            // Run a series of diagnostic tests
            console.log("Starting diagnostics...");
            
            // 1. Try a basic fetch to the endpoint
            try {
                const checkResponse = await fetch("https://scholarai.azurewebsites.net/api/claudeChat", {
                    method: "HEAD"
                });
                console.log("Endpoint check:", checkResponse.status, checkResponse.statusText);
            } catch (e) {
                console.log("Endpoint check failed:", e);
            }
            
            // 2. Test the actual API call
            const apiTest = await window.testAPI();
            console.log("API test result:", apiTest);
            
            // Display results
            alert(`Diagnostics complete! Check the console (F12) for detailed results.\n\nSummary: ${apiTest.success ? 'API connection succeeded' : 'API connection failed: ' + apiTest.error}`);
        };
        
        aiMain.appendChild(diagButton);
    }
    
    // Enhance the textarea with auto-resize functionality
    const userInput = document.getElementById('user-message');
    if (userInput) {
        // Set initial height
        setTimeout(() => {
            userInput.style.height = 'auto';
            userInput.style.height = (userInput.scrollHeight) + 'px';
            userInput.focus();
        }, 100);
    }
});
