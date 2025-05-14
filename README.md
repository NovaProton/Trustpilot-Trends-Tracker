# Trustpilot Trends Tracker

**Trustpilot Trends Tracker** is a Google Apps Script tool that fetches daily TrustScore and review count data from Trustpilot for multiple furniture retailers and logs it in a Google Sheet. It also compares today's data with the previous day's to highlight changes in review volume.

---

## ✨ Features

- Scrapes TrustScore and total review counts from Trustpilot's UK site
- Supports tracking for multiple company URLs
- Automatically stores data in Google Sheets with a timestamp
- Calculates day-over-day review growth
- Error handling with fallback data logging
- Uses historical sheet data to track trends over time

---

## 🧠 How It Works

1. The script checks if a row for each company and date already exists.
2. It fetches each company's Trustpilot page and scrapes:
   - **TrustScore** (e.g. 4.6)
   - **Total Reviews** (e.g. 2,389)
3. Compares today's review count with yesterday's to compute growth.
4. Appends the new data to the Google Sheet:
   - `Name`, `Website`, `TrustScore`, `Total Reviews`, `Yesterday's Reviews`, `Day-over-Day Growth`, `Last Updated`

---

## 📝 Setup

1. Open your target Google Sheet.
2. Go to **Extensions → Apps Script**.
3. Paste the full script into the editor.
4. Save and run `fetchTrustpilotData()` (you may need to authorise access).
5. Schedule automatic runs with **Triggers** to capture daily changes.

---

## 📊 Data Structure

| Name                | Website                           | TrustScore | Total Reviews | Yesterday's Reviews | Day-over-Day Growth | Last Updated        |
|---------------------|-----------------------------------|------------|----------------|----------------------|----------------------|----------------------|
| Company 1                  | Company1.uk      | 4.5        | 1234           | 1220                 | 14                   | 2025-05-14 09:00:00  |
| Company 2    | Company2.com                 | 3.8        | 932            | 930                  | 2                    | 2025-05-14 09:00:00  |

---

## ⚠️ Notes

- Make sure the header row exists (`Name`, `Website`, etc.) before the script is run.
- Trustpilot page structures may change, which could break parsing.
- This script scrapes HTML; API-based tracking is not used due to Trustpilot's limitations.

---

## 📄 License

MIT License – free to use and adapt.