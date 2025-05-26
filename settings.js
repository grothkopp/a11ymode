document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const normalizeTextToggle = document.getElementById('normalizeTextToggle');
    const viewportFixToggle = document.getElementById('viewportFixToggle');
    const customModulesListDiv = document.getElementById('customModulesList');
    const addCustomModuleForm = document.getElementById('addCustomModuleForm');
    const moduleNameInput = document.getElementById('moduleName');
    const moduleCodeInput = document.getElementById('moduleCode');
    const moduleTypeSelect = document.getElementById('moduleType');

    let customModules = []; // In-memory store for custom modules

    // --- Load Settings ---
    function loadSettings() {
        chrome.storage.sync.get(['defaultModules', 'customModules'], (result) => {
            // Load default module settings
            if (result.defaultModules) {
                normalizeTextToggle.checked = result.defaultModules.normalizeTextEnabled !== false; // Default true
                viewportFixToggle.checked = result.defaultModules.viewportFixEnabled !== false; // Default true
            } else {
                // Default to enabled if no settings are found
                normalizeTextToggle.checked = true;
                viewportFixToggle.checked = true;
            }

            // Load custom modules
            if (result.customModules) {
                customModules = result.customModules;
            }
            renderCustomModules();
        });
    }

    // --- Save Settings ---
    function saveSettings() {
        const defaultModulesSettings = {
            normalizeTextEnabled: normalizeTextToggle.checked,
            viewportFixEnabled: viewportFixToggle.checked
        };
        chrome.storage.sync.set({
            defaultModules: defaultModulesSettings,
            customModules: customModules
        }, () => {
            // console.log('Settings saved');
        });
    }

    // --- Render Custom Modules ---
    function renderCustomModules() {
        customModulesListDiv.innerHTML = ''; // Clear existing list

        if (customModules.length === 0) {
            customModulesListDiv.innerHTML = '<p>No custom modules added yet.</p>';
            return;
        }

        customModules.forEach((module, index) => {
            const item = document.createElement('div');
            item.classList.add('custom-module-item');

            const details = document.createElement('div');
            details.classList.add('details');
            details.innerHTML = `<strong>${escapeHTML(module.name)}</strong><em>Type: ${escapeHTML(module.type)}</em>`;

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                deleteCustomModule(index);
            });

            item.appendChild(details);
            item.appendChild(deleteButton);
            customModulesListDiv.appendChild(item);
        });
    }

    // --- Add Custom Module ---
    addCustomModuleForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = moduleNameInput.value.trim();
        const code = moduleCodeInput.value.trim();
        const type = moduleTypeSelect.value;

        if (!name || !code) {
            alert('Module name and code cannot be empty.');
            return;
        }

        customModules.push({ name, code, type, id: `custom_${Date.now()}` }); // Added an ID for potential future use, though index is used for delete now.
        renderCustomModules();
        saveSettings();

        // Clear form
        moduleNameInput.value = '';
        moduleCodeInput.value = '';
        moduleTypeSelect.value = 'onLoad'; // Reset to default
    });

    // --- Delete Custom Module ---
    function deleteCustomModule(index) {
        customModules.splice(index, 1);
        renderCustomModules();
        saveSettings();
    }

    // --- Event Listeners for Default Modules (Autosave) ---
    normalizeTextToggle.addEventListener('change', saveSettings);
    viewportFixToggle.addEventListener('change', saveSettings);

    // --- Utility to escape HTML ---
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // --- Initial Load ---
    loadSettings();
});
