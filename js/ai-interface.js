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
    
    // Add API testing function to help debug issues
    window.testAPI = async function() {
        try {
            const response = await fetch("https://scholarai.azurewebsites.net/api/claudeChat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: "Hello, this is a test message." })
            });
            
            console.log("API Test - Status:", response.status);
            console.log("API Test - Status Text:", response.statusText);
            console.log("API Test - Headers:", [...response.headers.entries()]);
            
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
    
    // Add a small button for testing API connectivity
    const aiMain = document.querySelector('.ai-main');
    if (aiMain) {
        const debugBtn = document.createElement('button');
        debugBtn.style.position = 'absolute';
        debugBtn.style.right = '10px';
        debugBtn.style.top = '10px';
        debugBtn.style.fontSize = '12px';
        debugBtn.style.padding = '4px 8px';
        debugBtn.style.background = 'rgba(255, 215, 0, 0.2)';
        debugBtn.style.border = '1px solid #ffd700';
        debugBtn.style.color = '#ffd700';
        debugBtn.style.borderRadius = '4px';
        debugBtn.style.cursor = 'pointer';
        debugBtn.textContent = 'Test API';
        debugBtn.style.zIndex = '1000';
        debugBtn.onclick = async function() {
            const result = await window.testAPI();
            alert(result.success ? 'API Connection Successful!' : `API Error: ${result.error}`);
        };
        
        aiMain.appendChild(debugBtn);
    }
});
