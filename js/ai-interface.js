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
    
    // Update API testing function to use the global FUNCTION_KEY
    window.testAPI = async function() {
        try {
            // Get the function key from the global variable
            const functionKey = window.FUNCTION_KEY || '';
            
            // Check if we have a valid key
            if (!functionKey || functionKey.length < 10) {
                return {
                    success: false,
                    error: "No API key provided. Add ?key=YOUR_API_KEY to the URL."
                };
            }
            
            const functionUrl = `https://scholarai.azurewebsites.net/api/claudeChat?code=${functionKey}`;
            
            const response = await fetch(functionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: "Hello, this is a test message." })
            });
            
            console.log("API Test - Status:", response.status);
            console.log("API Test - Status Text:", response.statusText);
            
            const data = await response.json();
            console.log("API Test - Response Data:", data);
            
            return {
                success: response.ok,
                status: response.status,
                data: data
            };
        } catch (error) {
            console.error("API Test - Error:", error);
            return {
                success: false,
                error: error.message
            };
        }
    };
    
    // Add a small form to allow entering API key if one is not found in the URL
    const aiMain = document.querySelector('.ai-main');
    if (aiMain && (!window.FUNCTION_KEY || window.FUNCTION_KEY.length < 10)) {
        const keyForm = document.createElement('div');
        keyForm.style.position = 'absolute';
        keyForm.style.right = '10px';
        keyForm.style.top = '10px';
        keyForm.style.display = 'flex';
        keyForm.style.gap = '5px';
        keyForm.style.zIndex = '100';
        
        const keyInput = document.createElement('input');
        keyInput.type = 'password';
        keyInput.placeholder = 'Enter API Key';
        keyInput.style.padding = '5px';
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
        
        keyButton.onclick = function() {
            if (keyInput.value.trim()) {
                window.FUNCTION_KEY = keyInput.value.trim();
                keyForm.remove();
                
                // Refresh the welcome message
                const messagesContainer = document.querySelector('.scholar-messages');
                if (messagesContainer) {
                    messagesContainer.innerHTML = '';
                    const welcomeDiv = document.createElement('div');
                    welcomeDiv.className = 'message ai-message';
                    welcomeDiv.innerHTML = `
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            Welcome to Scholar AI! How can I assist you today?
                        </div>
                    `;
                    messagesContainer.appendChild(welcomeDiv);
                }
            }
        };
        
        keyForm.appendChild(keyInput);
        keyForm.appendChild(keyButton);
        aiMain.appendChild(keyForm);
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
