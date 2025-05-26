# A11yMode: Accessibility On - by default.

## Description

A11yMode is a browser extension designed to enhance web accessibility. It automatically normalizes Unicode text to improve readability (e.g., converting "𝐁𝐨𝐥𝐝 𝐭𝐞𝐱𝐭" to "Bold text") and fixes common viewport issues that prevent users from zooming into web pages. Beyond these default features, A11yMode offers a powerful system for users to add their own custom JavaScript modules, allowing for targeted accessibility enhancements and site-specific fixes.

## Features

*   **Text Normalization:** Converts various Unicode font styles (bold, italic, script, etc.) back to standard text, improving screen reader compatibility and overall readability.
*   **Viewport Zoom Fix:** Modifies restrictive viewport meta tags to ensure users can zoom in on all web pages for better visibility.
*   **Modular Design:** Core functionalities are built as independent modules.
*   **Settings Page:** An intuitive settings page allows users to:
    *   Enable or disable the default text normalization and viewport fix modules.
    *   Add, manage, and delete custom JavaScript modules.
*   **Custom JavaScript Modules:** Users can add their own JavaScript snippets to run on web pages, categorized by execution type:
    *   `onLoad`: Executes when the page's DOM is initially loaded.
    *   `onNodeAdded`: Executes when a new HTML element is added to the page.
    *   `onCharacterDataChange`: Executes when text content within an element changes.
*   **Automatic Settings Access:** The settings page opens automatically when the extension is first installed or updated, guiding users through configuration.

## How to Use

### Installation

1.  Download the extension (e.g., from the Chrome Web Store or as a `.zip` file if sideloading).
2.  If sideloading:
    *   Open Chrome and navigate to `chrome://extensions`.
    *   Enable "Developer mode" using the toggle in the top right corner.
    *   Click "Load unpacked" and select the extension's directory.
3.  The extension will be installed and ready to use.

### Accessing Settings

*   **On Install/Update:** The settings page (`settings.html`) will automatically open in a new tab when the extension is first installed or updated to a new version.
*   **Via Extension Icon:** Click the A11yMode extension icon in the Chrome toolbar. This will also open the settings page.

### Managing Default Modules

On the settings page, under "Default Modules," you will find toggles for:

*   **Normalize Text Content:** Enable or disable the automatic normalization of Unicode text. Enabled by default.
*   **Fix Viewport Zoom Issues:** Enable or disable the automatic fix for restrictive viewport meta tags. Enabled by default.

Changes to these toggles are saved automatically.

### Adding Custom Modules

This powerful feature allows you to inject your own JavaScript code to run on web pages.

1.  Navigate to the "Custom Modules" section on the settings page.
2.  Fill in the "Add New Custom Module" form:
    *   **Module Name:** A descriptive name for your module (e.g., "Highlight New Sections," "Fix Broken ARIA Link").
    *   **JavaScript Code:** The JavaScript code you want to execute.
    *   **Module Type:** Choose when your code should run:
        *   `onLoad`: Runs once after the page's main content has loaded. Ideal for one-time setup, global style changes, or initial DOM manipulations.
        *   `onNodeAdded`: Runs every time a new HTML element (node) is dynamically added to the page after the initial load. Your script will receive the newly added `node` as an argument. Useful for modifying dynamically loaded content.
        *   `onCharacterDataChange`: Runs whenever the text content of an existing element changes. Your script will receive the `node` (which is typically a text node) whose data changed as an argument. Useful for reacting to dynamic text updates.

3.  Click the "Add Module" button. Your module will appear in the list and will be active immediately. Settings are saved automatically.

**Example Custom Module (`onNodeAdded` type):**

This module highlights new paragraphs by giving them a yellow background when they are added to the page.

```javascript
// Module Name: Highlight New Paragraphs
// Module Type: onNodeAdded

if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
  node.style.backgroundColor = 'yellow';
  console.log('A new paragraph was added and highlighted:', node);
}
```
*(Note: `node` is the argument automatically passed to `onNodeAdded` and `onCharacterDataChange` type modules by the extension.)*

### Deleting Custom Modules

To remove a custom module:

1.  Go to the "Custom Modules" section on the settings page.
2.  Find the module you wish to remove in the list.
3.  Click the "Delete" button next to it. The module will be removed, and settings will be saved automatically.

## Security Considerations for Custom Modules

The custom module feature allows you to run any JavaScript code on web pages you visit. This is a powerful capability but comes with security responsibilities:

*   **Code Execution:** Custom JavaScript code runs with the same permissions as the extension itself, meaning it can access and modify web page content.
*   **Trust:** Only use custom module code from sources you trust, or code that you have written and understand. Malicious code could potentially compromise your security or privacy.
*   **Review:** If you are unsure about a piece of code, it's best not to use it or to seek advice from someone knowledgeable in JavaScript and web security.

A11yMode aims to provide flexibility, but users should be cautious and responsible when adding custom scripts.

## Future Ideas (Optional)

*   **Export/Import Settings:** Allow users to export their configuration (including custom modules) to a file and import it later or on another device.
*   **Individual Enable/Disable for Custom Modules:** Add a toggle for each custom module, allowing users to temporarily disable them without deleting.
*   **More Module Types:** Explore additional event types for custom modules (e.g., `onAttributeChange`, specific keyboard events, etc.).
*   **Synchronized Module Order:** Allow users to re-order custom modules if execution order becomes critical for specific use cases.
*   **Community Repository (Advanced):** A curated list of useful and safe custom modules submitted by the community.

---
*This README provides an overview of A11yMode and its features. For detailed technical information, please refer to the source code.*
