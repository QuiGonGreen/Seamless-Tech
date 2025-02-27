document.addEventListener('DOMContentLoaded', function() {
    const newChatBtn = document.querySelector('.new-chat-btn');
    const aiMessages = document.querySelector('.ai-messages');
    const inputFrame = document.getElementById('ai-input-frame');
    const copilotFrame = document.getElementById('copilot-agent-frame');
    
    // Initialize the iframe content
    if (inputFrame) {
        inputFrame.addEventListener('load', function() {
            const iframeDoc = inputFrame.contentDocument || inputFrame.contentWindow.document;
            iframeDoc.body.innerHTML = `
                <form id="ai-form" style="display: flex; height: 100%;">
                    <textarea id="user-input" placeholder="Message Scholar AI..." 
                        style="flex-grow: 1; border: none; resize: none; padding: 10px; font-family: inherit; font-size: 14px; outline: none;"></textarea>
                    <button type="submit" style="background-color: #10a37f; color: white; border: none; padding: 0 15px; margin-left: 10px; border-radius: 4px; cursor: pointer;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </form>
            `;
            
            const form = iframeDoc.getElementById('ai-form');
            const textarea = iframeDoc.getElementById('user-input');
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const userInput = textarea.value.trim();
                if (userInput) {
                    addMessage(userInput, true);
                    textarea.value = '';
                    
                    // Simulate AI response after a brief delay
                    setTimeout(() => {
                        const responses = [
                            "I'm analyzing your request. Could you provide more details?",
                            "That's an interesting question. Based on my knowledge, I'd suggest exploring these ideas...",
                            "Here's what I found on that topic. Would you like me to elaborate further?",
                            "I've processed your request and have some relevant information to share."
                        ];
                        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                        addMessage(randomResponse, false);
                    }, 1000);
                }
            });

            // Auto-resize textarea as user types
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
        });
    }
    
    // Add a new message to the chat
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'ai-message user-message' : 'ai-message';
        
        messageDiv.innerHTML = `
            <div class="ai-avatar">
                <i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="ai-message-content">
                <p>${text}</p>
            </div>
        `;
        
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
    
    // Handle new chat button click
    if (newChatBtn && copilotFrame) {
        newChatBtn.addEventListener('click', function() {
            // If possible, send a message to the iframe to start a new conversation
            try {
                copilotFrame.contentWindow.postMessage({ action: 'newChat' }, '*');
            } catch (e) {
                console.log('Could not communicate with the copilot agent iframe:', e);
                
                // Fallback: reload the iframe to start fresh
                copilotFrame.src = copilotFrame.src;
            }
        });
    }
    
    // Make chat history items clickable
    const chatHistoryItems = document.querySelectorAll('.chat-history li');
    chatHistoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get the chat name/ID
            const chatName = this.textContent.trim();
            
            // If possible, send a message to the iframe to load this chat
            if (copilotFrame) {
                try {
                    copilotFrame.contentWindow.postMessage({ 
                        action: 'loadChat', 
                        chatName: chatName 
                    }, '*');
                } catch (e) {
                    console.log('Could not communicate with the copilot agent iframe:', e);
                }
            }
        });
    });
    
    // Listen for messages from the iframe (if your copilot agent supports this)
    window.addEventListener('message', function(event) {
        // Check origin for security
        // if (event.origin !== "https://your-copilot-agent-url.com") return;
        
        const data = event.data;
        
        // Example: Handle chat history updates
        if (data.action === 'updateHistory') {
            // Update the chat history in the sidebar
            console.log('Received chat history update:', data.chats);
            // Implementation would depend on your copilot agent's capabilities
        }
    });

    const iframe = document.getElementById('copilot-agent-frame');
    
    // Show loading state
    const aiMain = document.querySelector('.ai-main');
    const loadingElement = document.createElement('div');
    loadingElement.className = 'iframe-loading';
    loadingElement.innerHTML = '<div class="spinner"></div><p>Loading Scholar AI...</p>';
    aiMain.appendChild(loadingElement);
    
    // Handle iframe load event
    iframe.addEventListener('load', function() {
        // Remove loading indicator
        const loadingElement = document.querySelector('.iframe-loading');
        if (loadingElement) {
            loadingElement.style.opacity = '0';
            setTimeout(() => {
                loadingElement.remove();
            }, 500);
        }
        
        try {
            // Try to inject custom styles to the iframe
            // Note: This may fail due to same-origin policy if the iframe is from a different domain
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                body, html { 
                    background-color: #2a0066 !important;
                }
                
                *, p, span, div, button, input, textarea, a {
                    color: #ffd700 !important;
                    font-family: 'Segoe UI', Tahoma, sans-serif !important;
                }
            `;
            
            iframeDocument.head.appendChild(styleElement);
        } catch (e) {
            console.log('Could not access iframe contents due to same-origin policy.');
        }
    });
    
    // Attempt to periodically apply the VS Code style to the iframe
    // This is a fallback in case the iframe content reloads or changes dynamically
    let styleAttempts = 0;
    const maxAttempts = 5;
    
    function attemptStyleInjection() {
        if (styleAttempts >= maxAttempts) return;
        
        try {
            const iframeDocument = copilotFrame.contentDocument || copilotFrame.contentWindow.document;
            if (!iframeDocument.querySelector('#vscode-theme-style')) {
                const styleElement = document.createElement('style');
                styleElement.id = 'vscode-theme-style';
                styleElement.textContent = `
                    body, html { 
                        background-color: #2a0066 !important;
                        color: #ffd700 !important;
                    }
                    
                    * { color: #ffd700 !important; }
                `;
                iframeDocument.head.appendChild(styleElement);
                console.log('VS Code theme styles applied to iframe');
            }
        } catch (e) {
            console.log('Style injection attempt failed:', e);
            styleAttempts++;
            setTimeout(attemptStyleInjection, 2000); // Try again in 2 seconds
        }
    }
    
    // First attempt after iframe loads
    if (copilotFrame) {
        copilotFrame.addEventListener('load', function() {
            setTimeout(attemptStyleInjection, 1000);
        });
    }
});

// Add CSS for loading indicator
document.head.insertAdjacentHTML('beforeend', `
<style>
.iframe-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #2a0066;
    color: #ffd700;
    z-index: 10;
    transition: opacity 0.5s ease;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 215, 0, 0.3);
    border-radius: 50%;
    border-top-color: #ffd700;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
`);
