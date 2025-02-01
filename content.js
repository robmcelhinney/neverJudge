function processCoverImage(img) {
    console.log("img: ", img)
    browser.runtime.sendMessage(
        { action: "processImage", imageUrl: img.currentSrc },
        (response) => {
            if (browser.runtime.lastError) {
                console.error(
                    "Error processing cover image:",
                    browser.runtime.lastError.message
                )
            } else if (
                response &&
                typeof response === "object" &&
                response.text
            ) {
                console.log("Valid Response:", response)
                // Process valid response.
                let summaryDiv = document.createElement("div")
                summaryDiv.textContent = response.text
                summaryDiv.style.cssText =
                    "font-size: 1rem; padding: 10px; background: #f8f8f8; border: 1px solid #ddd;"
                img.replaceWith(summaryDiv)
            } else if (
                response &&
                typeof response === "object" &&
                response.error
            ) {
                console.error("Error from ML engine:", response.error)
            } else {
                console.error("Unexpected response:", response)
            }
        }
    )
}

// Process all existing cover images on page load.
function processAllCovers() {
    // Adjust selectors as needed – here we target both common Goodreads cover selectors.
    let covers = document.querySelectorAll(
        "img.gr-book__image, img.gr-bookCover, img.ResponsiveImage"
    )
    covers.forEach((img) => processCoverImage(img))
}

if (document.readyState === "complete") {
    processAllCovers()
} else {
    window.addEventListener("load", processAllCovers)
}
