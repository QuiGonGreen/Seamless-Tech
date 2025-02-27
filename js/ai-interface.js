document.addEventListener('DOMContentLoaded', function() {
    const newChatBtn = document.querySelector('.new-chat-btn');
    const chatHistoryItems = document.querySelectorAll('.chat-history li');
    const copilotFrame = document.getElementById('copilot-agent-frame');

    // Handle new chat button click if present
    if (newChatBtn && copilotFrame) {
        newChatBtn.addEventListener('click', function() {
            try {
                // Try to send a message to the iframe
                copilotFrame.contentWindow.postMessage({ action: 'newChat' }, '*');
            } catch (e) {
                console.log('Could not communicate with the copilot agent iframe:', e);
                // Fallback: reload the iframe
                copilotFrame.src = copilotFrame.src;
            }
        });
    }
    
    // Make chat history items clickable
    if (chatHistoryItems.length > 0 && copilotFrame) {
        chatHistoryItems.forEach(item => {
            item.addEventListener('click', function() {
                const chatName = this.textContent.trim();
                try {
                    copilotFrame.contentWindow.postMessage({ 
                        action: 'loadChat', 
                        chatName: chatName 
                    }, '*');
                } catch (e) {
                    console.log('Could not communicate with the copilot agent iframe:', e);
                }
            });
        });
    }
    
    // Apply direct styling to iframe content after it loads
    if (copilotFrame) {
        copilotFrame.addEventListener('load', function() {
            setTimeout(function() {
                try {
                    const iframeDocument = copilotFrame.contentDocument || copilotFrame.contentWindow.document;
                    
                    // Create and apply styling
                    const styleElement = document.createElement('style');
                    styleElement.id = 'scholar-theme';
                    styleElement.textContent = `
                        /* Base styles */
                        body, html { 
                            background-color: #2a0066 !important;
                        }
                        
                        /* Text styling */
                        body, div, span, p, button, input, textarea, a, label {
                            color: #ffd700 !important;
                            font-family: 'Consolas', 'Courier New', monospace !important;
                        }
                        
                        /* Form elements */
                        input, textarea, [contenteditable="true"] {
                            background-color: #3c0095 !important;
                            border: 1px solid #ffd700 !important;
                            color: #ffd700 !important;
                        }
                        
                        /* Buttons */
                        button, [role="button"] {
                            background-color: #3c0095 !important;
                            border: 1px solid #ffd700 !important;
                            color: #ffd700 !important;
                        }
                        
                        /* Links */
                        a {
                            color: #ffdf33 !important;
                        }
                        
                        /* Special elements - targets webchat elements specifically */
                        .webchat__bubble, .webchat__bubble--from-user, .webchat__bubble--from-bot {
                            background-color: #3c0095 !important;
                            border: 1px solid #ffd700 !important;
                        }
                    `;
                    
                    iframeDocument.head.appendChild(styleElement);
                    console.log('Purple and gold theme applied to iframe');
                } catch (e) {
                    console.log('Could not style iframe content:', e);
                }
            }, 1000); // Small delay to ensure iframe has fully loaded
        });
    }
});
