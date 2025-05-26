// --- Utility Functions ---
function normalizeText(text) {
  return text.normalize("NFKC");
}

// --- Core Logic for Text Normalization (used by default module) ---
function processSingleTextNode(textNode) {
  if (textNode.nodeType === Node.TEXT_NODE && textNode.textContent.trim()) {
    const normalizedText = normalizeText(textNode.textContent);
    if (normalizedText !== textNode.textContent) {
      textNode.textContent = normalizedText;
      // console.log("Text normalized for node:", textNode);
    }
  }
}

function processAllTextNodes(rootElement) {
  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let textNode;
  while (textNode = walker.nextNode()) {
    processSingleTextNode(textNode);
  }
}

// --- Main execution block after loading settings ---
chrome.storage.sync.get(['defaultModules', 'customModules'], (settings) => {
  const defaultSettings = { // Define defaults in case nothing is in storage
    normalizeTextEnabled: true,
    viewportFixEnabled: true,
    ...settings.defaultModules // Loaded settings will override defaults
  };
  const customModules = settings.customModules || [];

  // --- Default Module Definitions ---
  // These are predefined and their execution is controlled by settings
  const defaultModulesConfig = [
    {
      name: "viewportFixer",
      type: "onLoad",
      enabled: () => defaultSettings.viewportFixEnabled,
      execute: function() {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
          const content = viewportMeta.getAttribute('content');
          if (content && (content.includes('maximum-scale') || content.includes('user-scalable=0') || content.includes('user-scalable=no'))) {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
            // console.log("Default: Viewport meta updated (onLoad)");
          }
        }
      }
    },
    {
      name: "viewportFixerDynamic",
      type: "onNodeAdded",
      enabled: () => defaultSettings.viewportFixEnabled,
      execute: function(node) {
        if (node.nodeType === Node.ELEMENT_NODE &&
            node.tagName === 'META' &&
            node.getAttribute('name') === 'viewport') {
          const content = node.getAttribute('content');
          if (content && (content.includes('maximum-scale') || content.includes('user-scalable=0') || content.includes('user-scalable=no'))) {
            node.setAttribute('content', 'width=device-width, initial-scale=1.0');
            // console.log("Default: Viewport meta updated (onNodeAdded)");
          }
        }
      }
    },
    {
      name: "textNormalizerInitialLoad",
      type: "onLoad",
      enabled: () => defaultSettings.normalizeTextEnabled,
      execute: function() {
        processAllTextNodes(document.body);
        // console.log("Default: Initial text normalization (onLoad)");
      }
    },
    {
      name: "textNormalizerNodeAdded",
      type: "onNodeAdded",
      enabled: () => defaultSettings.normalizeTextEnabled,
      execute: function(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          processSingleTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          processAllTextNodes(node);
        }
      }
    },
    {
      name: "textNormalizerCharacterDataChange",
      type: "onCharacterDataChange",
      enabled: () => defaultSettings.normalizeTextEnabled,
      execute: function(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          processSingleTextNode(node);
        }
      }
    }
  ];

  // --- Page Load Logic ---
  function handlePageLoad() {
    // Execute enabled default onLoad modules
    defaultModulesConfig.forEach(module => {
      if (module.type === "onLoad" && module.enabled()) {
        try {
          module.execute();
        } catch (e) {
          console.error(`Error executing default module "${module.name}" (onLoad):`, e);
        }
      }
    });

    // Execute custom onLoad modules
    customModules.forEach(customModule => {
      if (customModule.type === "onLoad") {
        // console.log(`Executing custom module "${customModule.name}" (onLoad)`);
        try {
          const customFunc = new Function(customModule.code);
          customFunc();
        } catch (e) {
          console.error(`Error executing custom module "${customModule.name}" (onLoad):`, e);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handlePageLoad);
  } else {
    handlePageLoad();
  }

  // --- Mutation Observer Logic ---
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(node => {
          // Execute enabled default onNodeAdded modules
          defaultModulesConfig.forEach(module => {
            if (module.type === "onNodeAdded" && module.enabled()) {
              try {
                module.execute(node);
              } catch (e) {
                console.error(`Error executing default module "${module.name}" (onNodeAdded):`, e);
              }
            }
          });

          // Execute custom onNodeAdded modules
          customModules.forEach(customModule => {
            if (customModule.type === "onNodeAdded") {
              // console.log(`Executing custom module "${customModule.name}" (onNodeAdded) for node:`, node);
              try {
                const customFunc = new Function('node', customModule.code);
                customFunc(node);
              } catch (e) {
                console.error(`Error executing custom module "${customModule.name}" (onNodeAdded):`, e);
              }
            }
          });
        });
      } else if (mutation.type === "characterData") {
        const targetNode = mutation.target;
        // Execute enabled default onCharacterDataChange modules
        defaultModulesConfig.forEach(module => {
          if (module.type === "onCharacterDataChange" && module.enabled()) {
            try {
              module.execute(targetNode);
            } catch (e) {
              console.error(`Error executing default module "${module.name}" (onCharacterDataChange):`, e);
            }
          }
        });

        // Execute custom onCharacterDataChange modules
        customModules.forEach(customModule => {
          if (customModule.type === "onCharacterDataChange") {
            // console.log(`Executing custom module "${customModule.name}" (onCharacterDataChange) for node:`, targetNode);
            try {
              const customFunc = new Function('node', customModule.code);
              customFunc(targetNode);
            } catch (e) {
              console.error(`Error executing custom module "${customModule.name}" (onCharacterDataChange):`, e);
            }
          }
        });
      }
    }
  });

  // Start observing the document
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // console.log("Content script loaded with settings:", defaultSettings, "and custom modules:", customModules.length);
});
