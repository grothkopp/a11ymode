// Function to normalize Unicode text
function normalizeText(text) {
  return text.normalize("NFKC");
}

// Function to process text nodes
function processTextNode(node) {
  if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
    const normalizedText = normalizeText(node.textContent);
    if (normalizedText !== node.textContent) {
      node.textContent = normalizedText;
    }
  }
}

// Function to fix viewport meta tag that prevents zooming
function fixViewportMeta() {
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    const content = viewportMeta.getAttribute('content');
    if (content && (content.includes('maximum-scale') || content.includes('user-scalable=0') || content.includes('user-scalable=no'))) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
  }
}

// Create a mutation observer
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    // Check for added nodes
    mutation.addedNodes.forEach(node => {
      // Check if added node is a meta viewport tag
      if (node.nodeType === Node.ELEMENT_NODE && 
          node.tagName === 'META' && 
          node.getAttribute('name') === 'viewport') {
        fixViewportMeta();
      }

      // If it's a text node, process it directly
      if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node);
      } 
      // If it's an element, process all text nodes within it
      else if (node.nodeType === Node.ELEMENT_NODE) {
        const walker = document.createTreeWalker(
          node,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        let textNode;
        while (textNode = walker.nextNode()) {
          processTextNode(textNode);
        }
      }
    });
  }
});

// Function to process all text nodes in a given root element
function processExistingTextNodes(root) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let textNode;
  while (textNode = walker.nextNode()) {
    processTextNode(textNode);
  }
}

// Process existing text nodes when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    processExistingTextNodes(document.body);
    fixViewportMeta();
  });
} else {
  processExistingTextNodes(document.body);
  fixViewportMeta();
}

// Start observing the document with the configured parameters
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});
