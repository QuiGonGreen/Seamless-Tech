document.addEventListener('DOMContentLoaded', function() {
    const newChatBtn = document.querySelector('.new-chat-btn');
    const aiMessages = document.querySelector('.ai-messages');
    const inputFrame = document.getElementById('ai-input-frame');
    
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
    if (newChatBtn) {
        newChatBtn.addEventListener('click', function() {
            // Clear all existing messages except the first welcome message
            while (aiMessages.children.length > 1) {
                aiMessages.removeChild(aiMessages.lastChild);
            }
            
            // Reset the input field
            if (inputFrame.contentDocument) {
                const textarea = inputFrame.contentDocument.getElementById('user-input');
                if (textarea) textarea.value = '';
            }
        });
    }
    
    // Make chat history items clickable
    const chatHistoryItems = document.querySelectorAll('.chat-history li');
    chatHistoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Simulate loading a previous chat
            const chatName = this.textContent.trim();
            
            // Clear current messages
            while (aiMessages.children.length > 0) {
                aiMessages.removeChild(aiMessages.lastChild);
            }
            
            // Add a contextual message based on the selected chat
            addMessage(`Welcome back to "${chatName}". How can I assist you further?`, false);
        });
    });
});
