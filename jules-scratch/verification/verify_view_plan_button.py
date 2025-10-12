from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000")

    # Create a dummy file to upload
    with open("jules-scratch/verification/test.txt", "w") as f:
        f.write("This is a test file.")

    # Upload the file
    with page.expect_file_chooser() as fc_info:
        page.locator("div.flex.flex-col.items-center.justify-center.p-6").click()
    file_chooser = fc_info.value
    file_chooser.set_files("jules-scratch/verification/test.txt")

    # Click the process button
    page.get_by_role("button", name="Process Inputs").click()

    # Wait for the "View Generated Plan" button to appear
    page.wait_for_selector("text=View Generated Plan")

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)