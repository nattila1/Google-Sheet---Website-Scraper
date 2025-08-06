/**
 * Fetches product prices from URLs in a Google Sheet and updates the sheet with the prices.
 */

// Configuration (Update these with your actual values)
const SHEET_ID = `YOUR_SHEET_ID`; // Replace with your actual Sheet ID
const SHEET_NAME = `YOUR_SHEET_NAME`; // Replace with your actual Sheet Name
const URLS_COLUMN_ID = 1; // Column containing URLs (A = 1)
const CSS_SELECTOR_COLUMN = 2; // Column containing CSS selectors (B = 2)
const PRICE_COLUMN = 3; // Column to write prices (C = 3)
const REQUEST_DELAY = 1000; // Delay between requests in milliseconds (1 second)


/**
 * Main function to run the script.
 */
function main() {
  const urlData = getUrlsFromSheet();
  if (urlData.length === 0) {
    Logger.log("No URLs to process.");
    return;
  }

  const prices = [];
  for (let i = 0; i < urlData.length; i++) {
    const url = urlData[i].url;
    const selector = urlData[i].selector;
    const html = fetchHtml(url);
    const price = extractPrice(html, selector);
    prices.push(price);
    Utilities.sleep(REQUEST_DELAY); // Delay between requests
    Logger.log(`Processed URL ${i+1}/${urlData.length}: ${url}, Price: ${price}`);
  }

  updateSheet(prices);
}


/**
 * Opens the spreadsheet and gets the URLs and selectors.
 * @return {Array<{url: string, selector: string}>} An array of objects containing URLs and selectors.
 */
function getUrlsFromSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return []; // Handle empty sheet

  const urls = sheet.getRange(2, URLS_COLUMN_ID, lastRow - 1)
    .getValues()
    .flat(); // Get values as a 1D array.

  const selectors = sheet.getRange(2, CSS_SELECTOR_COLUMN, lastRow - 1)
    .getValues()
    .flat(); // Get values as a 1D array.

  const urlData = [];
  for (let i = 0; i < urls.length; i++) {
    urlData.push({
      url: urls[i],
      selector: selectors[i]
    });
  }
  return urlData;
}


/**
 * Fetches the HTML content of a URL.
 * @param {string} url The URL to fetch.
 * @return {string|null} The HTML content, or null if there's an error.
 */
function fetchHtml(url) {
  try {
    const options = {
      method: 'get',
      muteHttpExceptions: true,
      headers: { // Added some common headers
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      }
    };
    const response = UrlFetchApp.fetch(url, options);
    if (response.getResponseCode() === 200) {
      return response.getContentText();
    } else {
      Logger.log(`Error fetching ${url}: ${response.getResponseCode()} - ${response.getContentText()}`);
      return null;
    }
  } catch (error) {
    Logger.log(`Error fetching ${url}: ${error}`);
    return null;
  }
}


/**
 * Extracts the price from the HTML using Cheerio.
 * @param {string} html The HTML content.
 * @param {string} selector The CSS selector to use.
 * @return {number|null} The extracted price as a number, or null if not found.
 */
function extractPrice(html, selector) { // Added selector parameter
  if (!html || !selector) return null; // Added check for selector

  try {
    const $ = Cheerio.load(html);
    let priceText = $(selector).text(); // Use provided selector
    if (!priceText) {
      Logger.log("Price element not found using selector: " + selector);
      return null;
    }
    priceText = priceText.replace(/,/g,'.');
    let price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    if (isNaN(price)) {
      Logger.log("Could not parse price to a number: " + priceText);
      return null;
    }
    return price;
  } catch (error) {
    Logger.log("Error extracting price: " + error);
    return null;
  }
}


/**
 * Updates the Google Sheet with the extracted prices.
 * @param {Array<number|null>} prices An array of prices to write to the sheet.
 */
function updateSheet(prices) {
  if (prices.length === 0) return;

  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();
  const urlsCount = sheet.getRange(2, URLS_COLUMN_ID, lastRow - 1).getValues().flat().length;

  if (prices.length !== urlsCount) {
    Logger.log(`Number of prices (${prices.length}) does not match the number of URLs (${urlsCount}).`);
    return;
  }
  
  sheet.getRange(2, PRICE_COLUMN, prices.length, 1).setValues(prices.map(price => [price]));
}
