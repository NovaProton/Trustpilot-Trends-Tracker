function fetchTrustpilotData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // --- 1. Get Existing Data from Sheet ---
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; // Get headers from first row
  const lastRow = sheet.getLastRow();
  let existingData = {}; // Object to store existing data, keyed by company name
  if (lastRow > 1) { // Start from row 2 to skip headers
    const range = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
    const values = range.getValues();

    values.forEach(row => {
      let rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      const companyName = rowData["Name"]; // Assuming "Name" is the column header for company name
      const lastUpdatedDate = rowData["Last Updated"]; // Assuming "Last Updated" is the header for timestamp

      if (companyName && lastUpdatedDate instanceof Date) { // Ensure name and valid date
        const dateString = Utilities.formatDate(lastUpdatedDate, Session.getTimeZone(), "YYYY-MM-DD");
        if (!existingData[companyName]) {
          existingData[companyName] = {};
        }
        existingData[companyName][dateString] = rowData; // Store entire row data, can access 'Total Reviews' later
      }
    });
  }
  // Logger.log(JSON.stringify(existingData)); // Optional: Log existingData to check structure


  // Define Trustpilot URLs and associated names
  const websites = [
    { url: "Company1.uk", name: "Company 1" },
    { url: "Company2.com", name: "Company 1" },
    // { url: "URL", name: "Name" },
  ];

  // Ensure headers are in the sheet (only run once or if headers are missing)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Name", "Website", "TrustScore", "Total Reviews", "Yesterday's Reviews", "Day-over-Day Growth", "Last Updated"]);
  }


  websites.forEach((site) => {
    const trustpilotUrl = `https://uk.trustpilot.com/review/${site.url}`;
    try {
      // Fetch the HTML content
      const response = UrlFetchApp.fetch(trustpilotUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
      });
      const html = response.getContentText();

      // Extract TrustScore from meta tags
      const trustScoreRegex = /"ratingValue":"([\d.]+)"/;
      const totalReviewsRegex = /"reviewCount":"(\d+)"/;

      const trustScore = trustScoreRegex.exec(html)?.[1] || "N/A";
      const totalReviews = totalReviewsRegex.exec(html)?.[1] || "N/A";
      const totalReviewsToday = parseInt(totalReviews, 10) || 0; // Ensure Total Reviews is a number

      // --- 2. Lookup Yesterday's Reviews ---
      let yesterdayReviews = 0;
      const companyExistingData = existingData[site.name];
      if (companyExistingData) {
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayDateString = Utilities.formatDate(yesterdayDate, Session.getTimeZone(), "YYYY-MM-DD");
        const yesterdayData = companyExistingData[yesterdayDateString];
        if (yesterdayData) {
          yesterdayReviews = parseInt(yesterdayData["Total Reviews"], 10) || 0; // Get yesterday's reviews as number
        }
      }

      // --- 3. Calculate Day-over-Day Growth ---
      const dayOverDayGrowth = totalReviewsToday - yesterdayReviews;


      // --- 4. Append data to Google Sheet with new columns ---
      sheet.appendRow([
        site.name,
        site.url,
        trustScore,
        totalReviews,
        yesterdayReviews, // Yesterday's Reviews
        dayOverDayGrowth, // Day-over-Day Growth
        new Date() // Timestamp
      ]);

      Logger.log(`Fetched: ${site.name} - TrustScore: ${trustScore}, Total Reviews: ${totalReviews}, Yesterday's Reviews: ${yesterdayReviews}, Growth: ${dayOverDayGrowth}`);
    } catch (error) {
      Logger.log(`Error fetching data for ${site.name}: ${error.message}`);
      sheet.appendRow([site.name, site.url, "Error", "Error", "Error", "Error", new Date()]); // Added "Error" for new columns too
    }
  });
}