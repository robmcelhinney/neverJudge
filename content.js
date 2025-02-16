const listOfCovers = "img"

function processCoverImage(img) {
    console.log("Processing image: ", img)
    console.log("img.currentSrc: ", img.currentSrc)
    if (
        img.src.includes("/assets/layout/") ||
        img.src.includes("goodreads.com/users")
    ) {
        return
    }
    if (img.alt) {
        replaceImageWithText(img, img.alt)
    } else {
        if (img.currentSrc) {
            imageUrl = img.currentSrc
        } else {
            imageUrl = img.src
        }
        browser.runtime.sendMessage(
            { action: "processImage", imageUrl: imageUrl },
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
}

function pxToRem(px) {
    const baseFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
    )
    return px / baseFontSize
}

// Function to process and replace the image with a text div sized in rem
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
    summaryDiv.style.display = "inline-block" // Behaves like an inline element
    summaryDiv.style.verticalAlign = "middle"
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
    // Combined selectors for various Goodreads image types.
    let covers = document.querySelectorAll(listOfCovers)
    covers.forEach((img) => processCoverImage(img))
}

// IntersectionObserver to watch images as they enter the viewport.
const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target
                processCoverImage(img)
                observer.unobserve(img)
            }
        })
    },
    {
        root: null, // The viewport is the root.
        rootMargin: "0px",
        threshold: 0.1, // Trigger when at least 10% of the image is visible.
    }
)

// Observe all images matching our combined selectors.
function observeImages() {
    const images = document.querySelectorAll(listOfCovers)
    images.forEach((img) => {
        if (!img.dataset.processed) {
            // Only observe images not yet processed.
            observer.observe(img)
            img.dataset.processed = true
        }
    })
}

// Observe images present at page load.
if (document.readyState === "complete") {
    observeImages()
} else {
    window.addEventListener("load", observeImages)
}

// Use MutationObserver to watch for images added dynamically.
const mutationObserver = new MutationObserver(() => {
    observeImages()
})
mutationObserver.observe(document.body, { childList: true, subtree: true })
