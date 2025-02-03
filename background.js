// background.js

// Create the ML engine only once.
let enginePromise = browser.trial.ml.createEngine({
    modelHub: "mozilla",
    taskName: "image-to-text",
})

// Message listener for processing an image.
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action !== "processImage") {
        // For non-processImage messages, do nothing.
        return false
    }

    ;(async () => {
        try {
            console.log("Processing image:", message.imageUrl)
            await enginePromise // Ensure engine is ready.
            let result = await browser.trial.ml.runEngine({
                args: [message.imageUrl],
            })
            sendResponse({ text: result[0].generated_text })
        } catch (error) {
            console.error("ML processing failed:", error)
            sendResponse({ error: error.message })
        }
    })()
    // Return true to indicate an async response.
    return true
})
