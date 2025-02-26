document.addEventListener('DOMContentLoaded', function() {
  const iframe = document.getElementById('copilot-agent-frame');
  
  // Wait for iframe to load
  iframe.addEventListener('load', function() {
    try {
      // Try to access iframe content
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      
      // Create style element
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        body {
          background-color: #2a0066 !important; /* Deep purple background */
          font-family: 'Cascadia Code', 'Consolas', monospace !important;
        }

        /* Style text elements to be yellow/gold */
        p, span, div, button, input, textarea, a {
          color: #ffd700 !important; /* Gold text */
          font-family: 'Cascadia Code', 'Consolas', monospace !important;
        }

        /* Ensure input fields and textareas are still readable */
        input, textarea {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid #ffd700 !important;
        }

        /* Style buttons */
        button {
          background-color: rgba(255, 215, 0, 0.2) !important;
          border: 1px solid #ffd700 !important;
        }
      `;
      
      // Append style to iframe document head
      iframeDocument.head.appendChild(styleElement);
      
      // Alternative approach: inject a link to external stylesheet
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.type = 'text/css';
      linkElement.href = window.location.origin + '/css/scholar-theme.css';
      iframeDocument.head.appendChild(linkElement);
      
    } catch (e) {
      console.error("Could not style iframe due to same-origin policy:", e);
      // If we can't directly access the iframe due to same-origin policy,
      // we can try loading the iframe with a custom URL that includes our styling
    }
  });
});
