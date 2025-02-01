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

                replaceImageWithText(img, response.text)
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

function pxToRem(px) {
    const baseFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
    )
    return px / baseFontSize
}

// Function to process and replace the image
function replaceImageWithText(img, text) {
    // Calculate the image dimensions in rem
    const widthInRem = pxToRem(img.width)
    const heightInRem = pxToRem(img.height)

    // Create the replacement div
    const summaryDiv = document.createElement("div")
    summaryDiv.textContent = text

    // Apply styles to the div
    summaryDiv.style.width = `${widthInRem}rem`
    summaryDiv.style.height = `${heightInRem}rem`
    summaryDiv.style.display = "flex"
    summaryDiv.style.alignItems = "center"
    summaryDiv.style.justifyContent = "center"
    summaryDiv.style.textAlign = "center"
    summaryDiv.style.padding = "0.5rem"
    summaryDiv.style.background = "#f8f8f8"
    summaryDiv.style.border = "1px solid #ddd"
    summaryDiv.style.overflow = "hidden"

    // Replace the image with the div
    img.replaceWith(summaryDiv)
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
