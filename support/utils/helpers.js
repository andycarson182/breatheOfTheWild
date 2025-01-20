// Wait for elements to load
export async function waitForElementsToLoad(t, elements, retries = 5, delay = 1000) {
    while (retries > 0) {
        const count = await elements.count;
        if (count > 0) return count;
        await t.wait(delay);
        retries--;
    }
    throw new Error('Elements did not load in time.');
}

// Extract text from elements into an array with optional normalization and digit removal
export async function extractTextFromElements(elements, normalize = true, removeNonDigits = false) {
    const count = await elements.count;
    const textArray = [];
    for (let i = 0; i < count; i++) {
        let text = await elements.nth(i).innerText;
        if (removeNonDigits) {
            text = text.replace(/\D/g, '').trim(); // Removes non-digit characters if needed
        }
        textArray.push(normalize ? text.toLowerCase() : text); // Normalize to lowercase if required
    }
    return textArray;
}

// Verify presence of UI elements for each device
export async function verifyUIElements(t, elements, description) {
    const count = await elements.count;
    for (let i = 0; i < count; i++) {
        const exists = await elements.nth(i).exists;
        await t.expect(exists).ok(`${description} for device ${i + 1} is not found in UI`);
    }
}

// Reload page function
export async function reloadPage(t){
    await t.eval(() => location.reload()); 
}