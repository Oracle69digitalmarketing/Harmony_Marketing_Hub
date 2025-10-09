from playwright.sync_api import sync_playwright, Page, expect

def verify_file_uploader(page: Page):
    """
    This script verifies that the file uploader component is correctly
    rendered on the main dashboard page.
    """
    # 1. Arrange: Go to the application's homepage.
    page.goto("http://localhost:3000")

    # Wait for the page to be fully loaded
    page.wait_for_load_state("networkidle")

    # 2. Assert: Check that the file uploader card is visible.
    uploader_card_title = page.locator("div.text-2xl:has-text('Start Here: Upload Your Data')")
    expect(uploader_card_title).to_be_visible()

    # Locate the card element itself to take a screenshot of the whole component
    uploader_card = uploader_card_title.locator("xpath=./../..")

    # 3. Screenshot: Capture the file uploader component for visual verification.
    uploader_card.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_file_uploader(page)
        browser.close()

if __name__ == "__main__":
    main()