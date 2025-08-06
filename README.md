# Google Sheets Web Scraper 📈

A simple yet powerful Google Apps Script to automate web scraping directly within Google Sheets. Track product prices, stock information, or any other data from websites without leaving your spreadsheet.



---

## Features

* **Dynamic Input:** Reads URLs and CSS selectors directly from your sheet. No code changes are needed to add or remove targets.
* **HTML Parsing:** Fetches and parses HTML from any public website.
* **Precise Extraction:** Uses the powerful Cheerio library for easy and accurate data extraction with CSS selectors.
* **Automated Write-Back:** Writes extracted data back to the sheet automatically in the specified column.
* **Responsible Scraping:** Includes a configurable delay to avoid overwhelming servers.
* **Scheduling:** Set it and forget it with Google Apps Script's built-in time-based triggers to run daily, hourly, etc.

---

## How It Works

The workflow is straightforward and entirely contained within your Google Sheet and its bound Apps Script project:

1.  **Read:** The script reads a list of URLs and their corresponding CSS selectors from the configured columns in your Google Sheet.
2.  **Fetch:** For each entry, it sends an HTTP request using `UrlFetchApp` to get the target page's full HTML content.
3.  **Parse:** The fetched HTML is loaded into the **Cheerio library**, which enables jQuery-like traversal of the document. The script uses the provided CSS selector to find the exact element you want (e.g., a `<span>` containing a price).
4.  **Extract & Clean:** It extracts the text content from the found element and cleans it up, removing currency symbols and commas to get a clean number.
5.  **Write:** Finally, it writes the extracted price back into the designated column in the sheet, right next to the original URL.

---

## Technology Stack

* **[Google Apps Script](https://developers.google.com/apps-script):** The serverless JavaScript platform that powers the automation.
* **[Google Sheets](https://www.google.com/sheets/about/):** Acts as both the input database and the output display.
* **[Cheerio](https://cheerio.js.org/):** A fast, flexible, and lean implementation of core jQuery designed specifically for the server, used for parsing HTML.

---

## Setup

For a detailed walkthrough with screenshots, please refer to the full guide:

➡️ **[The Ultimate Guide to Web Scraping with Google Apps Script and Google Sheets](https://bestflow.io/blog/posts/the-ultimate-guide-to-web-scraping-with-google-apps-script-and-google-sheets/)**

---

### 1. Prepare Your Google Sheet

Create a new Google Sheet or use this **[template](https://docs.google.com/spreadsheets/d/1g1zC_wpgtPRfUPoTUpY94T9g1J7gS0n8vO4F_Rk-a2c/edit?usp=sharing)**. Your sheet needs three columns:

* **Column A:** The full **URL** of the product or page you want to scrape.
* **Column B:** The **CSS Selector** that points to the specific element on the page (e.g., the price).
* **Column C:** This column will be automatically populated with the **scraped price**.

### 2. Add the Script Code

1.  Open your Google Sheet, go to **Extensions** > **Apps Script**.
2.  Delete any boilerplate code in the `Code.gs` file and paste the code from this repository.
3.  Configure the script by updating the global variables at the top of the file to match your sheet:
    * `SHEET_ID`: You can find this long string of characters in your Google Sheet's URL.
    * `SHEET_NAME`: The name of the sheet (tab) you are using (e.g., "Sheet1").

### 3. Add the Cheerio Library ⚙️

This script requires the Cheerio library to parse HTML.

1.  In the Apps Script editor, click the **+** icon next to "Libraries".
2.  In the "Script ID" field, enter the following ID:
    ```
    1ReeQ6WO8kKNxoaA_O0XEQ589cIrRvEBA9qcWpNqdOP17i47u6N9M5Xh0
    ```
3.  Click **Look up**. Select the latest version and click **Add**.

### 4. Find Your CSS Selectors

To tell the script what to extract, you need to provide a CSS selector for each URL.

1.  In Chrome, navigate to the target webpage.
2.  Right-click the element you want to scrape (e.g., the price) and select **Inspect**.
3.  The Developer Tools will open with the element's HTML highlighted.
4.  Right-click the highlighted line, then go to **Copy** > **Copy selector**.
5.  Paste this selector into Column B of your spreadsheet.

### 5. Run the Script

1.  Save the project in the Apps Script editor.
2.  Select the `main` function from the dropdown menu and click **Run**.
3.  The first time you run it, Google will ask for permissions. Authorize the script to allow it to access your spreadsheets and fetch external URLs.

### 6. Schedule Automatic Runs (Optional) 🕒

To have the scraper run automatically:

1.  In the Apps Script editor, go to the **Triggers** tab (the clock icon).
2.  Click **+ Add Trigger**.
3.  Configure the trigger:
    * Choose function to run: `main`
    * Select event source: `Time-driven`
    * Select type of time based trigger: `Day timer`
    * Select time of day: e.g., `Midnight to 1am`
4.  Click **Save**. The script will now run automatically every day.

---

## Limitations

* **Dynamic Websites:** This script works best for websites where the content is present in the initial HTML (server-side rendered). It cannot parse data that is loaded dynamically with JavaScript after the page loads.
* **Anti-Scraping:** Websites with advanced anti-scraping measures (like Cloudflare protection, CAPTCHAs, or IP blocking) may block `UrlFetchApp`. For these sites, a dedicated third-party scraping service (e.g., Apify, Bright Data) is recommended.
* **Be Ethical:** Always scrape responsibly. Respect the website's `robots.txt` file and its Terms of Service. Avoid making too many requests in a short period.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
