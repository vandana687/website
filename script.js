// Q2: Event tracking system
document.addEventListener('DOMContentLoaded', function() {
    // Log page view on load
    logEvent('view', 'page', 'Page loaded');
    
    // Track all clicks on the document
    document.addEventListener('click', function(event) {
        // Get the clicked element
        let target = event.target;
        
        // Determine the type of element clicked
        let objectType = getElementType(target);
        
        // Log the click event
        logEvent('click', objectType, target.tagName + (target.id ? ' #' + target.id : '') + (target.className ? ' .' + target.className : ''));
    });
    
    // Track all mouseover events (page views of elements)
    document.addEventListener('mouseover', function(event) {
        // We only want to log element views when the mouse hovers for a moment
        if (!event.target._viewLogged) {
            event.target._viewLogged = true;
            
            // Reset the flag after some time to allow re-logging
            setTimeout(function() {
                event.target._viewLogged = false;
            }, 5000); // Don't log again for 5 seconds
            
            // Get the hovered element
            let target = event.target;
            
            // Skip logging for very common elements to avoid spam
            if (target.tagName === 'HTML' || target.tagName === 'BODY' || target === document) {
                return;
            }
            
            // Determine the type of element viewed
            let objectType = getElementType(target);
            
            // Log the view event
            logEvent('view', objectType, target.tagName + (target.id ? ' #' + target.id : '') + (target.className ? ' .' + target.className : ''));
        }
    });
    
    // Function to determine element type
    function getElementType(element) {
        if (element.tagName === 'IMG') return 'image';
        if (element.tagName === 'A') return 'link';
        if (element.tagName === 'BUTTON') return 'button';
        if (element.tagName === 'INPUT') {
            if (element.type === 'text' || element.type === 'password' || element.type === 'email') return 'text-input';
            if (element.type === 'button' || element.type === 'submit') return 'button';
            if (element.type === 'checkbox') return 'checkbox';
            if (element.type === 'radio') return 'radio-button';
            return 'input-' + element.type;
        }
        if (element.tagName === 'SELECT') return 'drop-down';
        if (element.tagName === 'TEXTAREA') return 'text-area';
        if (element.tagName === 'LI' || element.tagName === 'UL' || element.tagName === 'OL') return 'list';
        if (element.tagName === 'TABLE' || element.tagName === 'TR' || element.tagName === 'TD' || element.tagName === 'TH') return 'table';
        if (element.tagName === 'DIV' || element.tagName === 'SECTION') {
            if (element.id) return 'section-' + element.id;
            return 'container';
        }
        if (element.tagName === 'P' || element.tagName === 'SPAN' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3') return 'text';
        
        // Default case
        return 'element-' + element.tagName.toLowerCase();
    }
    
    // Function to log events to console and UI
    function logEvent(eventType, objectType, details) {
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp}, ${eventType}, ${objectType}: ${details}`;
        
        // Log to console as required by Q2
        console.log(logEntry);
        
        // Also display in UI for user feedback
        const logContainer = document.getElementById('event-log-entries');
        const logItem = document.createElement('div');
        logItem.textContent = logEntry;
        
        // Add new entries at the top
        if (logContainer.firstChild) {
            logContainer.insertBefore(logItem, logContainer.firstChild);
        } else {
            logContainer.appendChild(logItem);
        }
        
        // Keep only the last 10 entries to avoid clutter
        while (logContainer.children.length > 10) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }
});

// Q3: Text Analysis System
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('analyze-btn').addEventListener('click', function() {
        const text = document.getElementById('text-input').value;
        
        if (text.trim().length === 0) {
            alert('Please enter some text to analyze.');
            return;
        }
        
        // Basic text statistics
        const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
        const wordCount = text.trim().split(/\s+/).length;
        const spaceCount = (text.match(/\s/g) || []).length;
        const newlineCount = (text.match(/\n/g) || []).length;
        const specialCount = (text.match(/[^\w\s]/g) || []).length;
        
        // Update basic statistics
        document.getElementById('letter-count').textContent = letterCount;
        document.getElementById('word-count').textContent = wordCount;
        document.getElementById('space-count').textContent = spaceCount;
        document.getElementById('newline-count').textContent = newlineCount;
        document.getElementById('special-count').textContent = specialCount;
        
        // Tokenize the text
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        
        // Define lists of tokens to search for
        const pronouns = [
            'i', 'me', 'my', 'mine', 'myself',
            'you', 'your', 'yours', 'yourself', 'yourselves',
            'he', 'him', 'his', 'himself',
            'she', 'her', 'hers', 'herself',
            'it', 'its', 'itself',
            'we', 'us', 'our', 'ours', 'ourselves',
            'they', 'them', 'their', 'theirs', 'themselves',
            'who', 'whom', 'whose', 'this', 'that', 'these', 'those'
        ];
        
        const prepositions = [
            'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around',
            'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond',
            'by', 'despite', 'down', 'during', 'except', 'for', 'from', 'in', 'inside',
            'into', 'like', 'near', 'of', 'off', 'on', 'onto', 'out', 'outside', 'over',
            'past', 'since', 'through', 'throughout', 'to', 'toward', 'towards', 'under',
            'underneath', 'until', 'up', 'upon', 'with', 'within', 'without'
        ];
        
        const articles = ['a', 'an', 'the']; // Including 'the' for completeness
        
        // Count occurrences
        const pronounCounts = countOccurrences(words, pronouns);
        const prepositionCounts = countOccurrences(words, prepositions);
        const articleCounts = countOccurrences(words, articles);
        
        // Update tables
        updateTable('pronouns-table', pronounCounts);
        updateTable('prepositions-table', prepositionCounts);
        updateTable('articles-table', articleCounts);
        
        // Show results
        document.getElementById('analysis-results').style.display = 'block';
    });
});

// Function to count occurrences of tokens
function countOccurrences(words, tokenList) {
    const counts = {};
    
    // Initialize counts for all tokens
    tokenList.forEach(token => {
        counts[token] = 0;
    });
    
    // Count occurrences
    words.forEach(word => {
        if (tokenList.includes(word)) {
            counts[word]++;
        }
    });
    
    return counts;
}

// Function to update tables with counts
function updateTable(tableId, counts) {
    const table = document.getElementById(tableId);
    
    // Clear existing rows except header
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    
    // Add rows for each token with non-zero count
    Object.entries(counts)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
        .forEach(([token, count]) => {
            const row = table.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.textContent = token;
            cell2.textContent = count;
        });
    
    // If no tokens found, add a "None found" row
    if (table.rows.length === 1) {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.textContent = "None found";
        cell2.textContent = "0";
        cell1.colSpan = 2;
        cell2.style.display = "none";
    }
}