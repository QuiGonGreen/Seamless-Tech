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
            const functionKey = window.FUNCTION_KEY || '';

            if (!functionKey || functionKey.length < 10) {
                return {
                    success: false,
                    error: "No API key provided. Please use the API key form in the top right."
                };
            }

            const functionUrl = `https://scholarai.azurewebsites.net/api/claudeChat`;

            const response = await fetch(functionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": functionKey // Send key in header, not URL
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
    
    // Fix the API key form to ensure it's visible
    const aiMain = document.querySelector('.ai-main');
    if (aiMain) {
        console.log("Creating API key form...");
        
        // Remove any existing key form to avoid duplication
        const existingForm = document.querySelector('.api-key-form');
        if (existingForm) {
            existingForm.remove();
        }
        
        const keyForm = document.createElement('div');
        keyForm.className = 'api-key-form';
        keyForm.style.position = 'absolute';
        keyForm.style.right = '10px';
        keyForm.style.top = '10px';
        keyForm.style.display = 'flex';
        keyForm.style.gap = '5px';
        keyForm.style.zIndex = '1000'; // Increase z-index to ensure visibility
        keyForm.style.padding = '8px';
        keyForm.style.backgroundColor = 'rgba(42, 0, 102, 0.3)'; // Add slight background for visibility
        keyForm.style.borderRadius = '4px';
        
        // Check if we already have a key
        const savedKey = localStorage.getItem('scholar_api_key') || '';
        if (savedKey && savedKey.length > 10) {
            console.log("API key found in localStorage");
            window.FUNCTION_KEY = savedKey;
            
            const keyInfo = document.createElement('div');
            keyInfo.style.padding = '5px 10px';
            keyInfo.style.backgroundColor = 'rgba(42, 0, 102, 0.8)';
            keyInfo.style.color = '#ffd700';
            keyInfo.style.borderRadius = '4px';
            keyInfo.style.border = '1px solid #ffd700';
            keyInfo.style.fontSize = '12px';
            keyInfo.textContent = 'API Key: Set ✓';
            
            const resetBtn = document.createElement('button');
            resetBtn.textContent = 'Reset Key';
            resetBtn.style.marginLeft = '5px';
            resetBtn.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            resetBtn.style.color = '#ffd700';
            resetBtn.style.border = '1px solid #ffd700';
            resetBtn.style.borderRadius = '4px';
            resetBtn.style.padding = '2px 5px';
            resetBtn.style.fontSize = '11px';
            resetBtn.style.cursor = 'pointer';
            
            resetBtn.onclick = function() {
                if (confirm('Are you sure you want to reset your API key?')) {
                    localStorage.removeItem('scholar_api_key');
                    window.FUNCTION_KEY = '';
                    location.reload();
                }
            };
            
            keyInfo.appendChild(resetBtn);
            keyForm.appendChild(keyInfo);
        } else {
            console.log("No API key found, showing input form");
            
            const keyLabel = document.createElement('label');
            keyLabel.textContent = 'API Key:';
            keyLabel.style.color = '#ffd700';
            keyLabel.style.fontSize = '12px';
            keyLabel.style.marginRight = '5px';
            keyLabel.style.alignSelf = 'center';
            
            const keyInput = document.createElement('input');
            keyInput.type = 'password';
            keyInput.placeholder = 'Enter API Key';
            keyInput.style.padding = '5px';
            keyInput.style.width = '180px'; // Make input wider
            keyInput.style.borderRadius = '4px';
            keyInput.style.border = '1px solid #ffd700';
            keyInput.style.backgroundColor = 'rgba(42, 0, 102, 0.8)';
            keyInput.style.color = '#ffd700';
            
            const keyButton = document.createElement('button');
            keyButton.textContent = 'Set Key';
            keyButton.style.backgroundColor = '#ffd700';
            keyButton.style.color = '#2a0066';
            keyButton.style.border = 'none';
            keyButton.style.borderRadius = '4px';
            keyButton.style.padding = '5px 10px';
            keyButton.style.cursor = 'pointer';
            
            // Handle Enter key in the input
            keyInput.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    keyButton.click();
                }
            });
            
            keyButton.onclick = function() {
                if (keyInput.value.trim()) {
                    // Save key to localStorage
                    localStorage.setItem('scholar_api_key', keyInput.value.trim());
                    window.FUNCTION_KEY = keyInput.value.trim();
                    
                    // Show success notification
                    const notification = document.createElement('div');
                    notification.textContent = 'API Key saved successfully!';
                    notification.style.position = 'fixed';
                    notification.style.top = '20px';
                    notification.style.left = '50%';
                    notification.style.transform = 'translateX(-50%)';
                    notification.style.backgroundColor = '#4CAF50';
                    notification.style.color = 'white';
                    notification.style.padding = '10px 20px';
                    notification.style.borderRadius = '4px';
                    notification.style.zIndex = '1000';
                    document.body.appendChild(notification);
                    
                    // Remove notification after 3 seconds
                    setTimeout(() => {
                        notification.style.opacity = '0';
                        notification.style.transition = 'opacity 0.5s ease';
                        setTimeout(() => notification.remove(), 500);
                    }, 3000);
                    
                    // Refresh the page to use the new API key
                    location.reload();
                }
            };
            
            keyForm.appendChild(keyLabel);
            keyForm.appendChild(keyInput);
            keyForm.appendChild(keyButton);
        }
        
        // Ensure the form is appended to the DOM
        aiMain.appendChild(keyForm);
        console.log("API key form added to the DOM");
    } else {
        console.error("Could not find .ai-main element to append the API key form");
    }
    
    // Add diagnostics button for deeper troubleshooting
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
            
            // 1. Check if we have a function key
            console.log("Key check:", window.FUNCTION_KEY ? 
                        `Key present (${window.FUNCTION_KEY.substring(0, 3)}...)` : 
                        "No key found");
            
            // 2. Try a basic fetch to the endpoint (without the key)
            try {
                const checkResponse = await fetch("https://scholarai.azurewebsites.net/api/claudeChat", {
                    method: "HEAD"
                });
                console.log("Endpoint check:", checkResponse.status, checkResponse.statusText);
            } catch (e) {
                console.log("Endpoint check failed:", e);
            }
            
            // 3. Test the actual API call
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
