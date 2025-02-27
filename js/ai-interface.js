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
