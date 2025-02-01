# Goodreads Cover AI

A Firefox extension that leverages the new `image-to-text` ML inference API to replace Goodreads book cover images with AI-generated descriptions.

## Installation

1. Clone this repo.
2. In Firefox, navigate to `about:debugging`.
3. Click **This Firefox** > **Load Temporary Add-on...** and select the `manifest.json` file.

## How It Works

-   The extension targets Goodreads pages and selects images with the `.bookCover` class.
-   It fetches each cover image, runs it through Firefox's ML inference API, and replaces the image with a styled div containing the generated text.

## Notes

-   Ensure your Firefox version supports the `ml` permission and the `image-to-text` API.
-   Adjust the image selector if Goodreads updates their DOM structure.
