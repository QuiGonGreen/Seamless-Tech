document.addEventListener('DOMContentLoaded', function() {
    // Comic book data - add your own content here
    const comics = [
        {
            video: "Images/comics/page1.mp4",
            text: "In the beginning, there was chaos. A digital wasteland of unorganized files and scattered data."
        },
        {
            video: "Images/comics/page2.mp4",
            text: "Then came the architects of order, bringing structure to the digital realm."
        },
        {
            video: "Images/comics/page3.mp4",
            text: "Networks began to form, connecting distant minds across the vastness of cyberspace."
        },
        {
            video: "Images/comics/page4.mp4",
            text: "As technology evolved, so did our understanding of how to navigate this complex digital landscape."
        }
        // Add more pages as needed
    ];

    const book = document.getElementById('book');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Generate pages from comics data
    let currentPage = 0;
    const totalPages = comics.length + 1; // +1 for the cover
    
    // Create all pages
    function createPages() {
        // Cover is already in the HTML
        
        // Add content pages
        comics.forEach((comic, index) => {
            const pageElement = document.createElement('div');
            pageElement.className = 'page';
            pageElement.id = `page-${index + 1}`;
            pageElement.style.zIndex = totalPages - (index + 1);
            
            const pageContent = document.createElement('div');
            pageContent.className = 'page-content';
            
            // Video container
            const videoContainer = document.createElement('div');
            videoContainer.className = 'page-video';
            
            const video = document.createElement('video');
            video.muted = true;
            video.loop = true;
            
            const source = document.createElement('source');
            source.src = comic.video;
            source.type = 'video/mp4';
            
            video.appendChild(source);
            videoContainer.appendChild(video);
            
            // Text container
            const textContainer = document.createElement('div');
            textContainer.className = 'page-text';
            
            const paragraph = document.createElement('p');
            paragraph.textContent = comic.text;
            
            textContainer.appendChild(paragraph);
            
            // Append to page content
            pageContent.appendChild(videoContainer);
            pageContent.appendChild(textContainer);
            pageElement.appendChild(pageContent);
            
            book.appendChild(pageElement);
        });
        
        updateButtons();
    }
    
    // Handle page turning
    function goNextPage() {
        if (currentPage < totalPages - 1) {
            const currentPageElem = getPageElement(currentPage);
            currentPageElem.classList.add('flipped');
            
            // Play video on the next page if it exists
            const nextPageElem = getPageElement(currentPage + 1);
            if (nextPageElem) {
                const video = nextPageElem.querySelector('video');
                if (video) {
                    video.play().catch(e => console.log("Video play failed:", e));
                }
            }
            
            currentPage++;
            updateButtons();
        }
    }
    
    function goPrevPage() {
        if (currentPage > 0) {
            const currentPageElem = getPageElement(currentPage - 1);
            currentPageElem.classList.remove('flipped');
            
            // Play video on the current page if it exists
            const video = currentPageElem.querySelector('video');
            if (video) {
                video.play().catch(e => console.log("Video play failed:", e));
            }
            
            currentPage--;
            updateButtons();
        }
    }
    
    function getPageElement(pageIndex) {
        if (pageIndex === 0) {
            return document.getElementById('cover');
        } else {
            return document.getElementById(`page-${pageIndex}`);
        }
    }
    
    // Update button states
    function updateButtons() {
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;
    }
    
    // Event listeners
    nextBtn.addEventListener('click', goNextPage);
    prevBtn.addEventListener('click', goPrevPage);
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            goNextPage();
        } else if (e.key === 'ArrowLeft') {
            goPrevPage();
        }
    });
    
    // Create the page elements
    createPages();
    
    // Play the video on the cover
    const coverVideo = document.querySelector('#cover video');
    if (coverVideo) {
        coverVideo.play().catch(e => console.log("Cover video play failed:", e));
    }
    
    // Create folder structure notice
    console.log("Please create the following folder structure for your comics:");
    console.log("Images/comics/ - Place your videos and cover image here");
    console.log("Required files: cover.jpg, page1.mp4, page2.mp4, etc.");
});
