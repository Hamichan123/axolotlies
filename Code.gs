/**
 * Axolotlies — Waitlist backend (Google Apps Script)
 * -------------------------------------------------------------
 * Saves each waitlist application as a new row in your Google Sheet.
 *
 * SETUP (5 minutes):
 *  1. Create a Google Sheet (this is your private "tank").
 *  2. In the Sheet: Extensions ▸ Apps Script.
 *  3. Delete any sample code, paste THIS whole file, and Save.
 *  4. Click Deploy ▸ New deployment.
 *       - Type: Web app
 *       - Description: Axolotlies waitlist
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Click Deploy, authorise the permissions it asks for.
 *  5. Copy the "Web app URL" it gives you (ends with /exec).
 *  6. Paste that URL into apply.html ▸ CONFIG.SCRIPT_URL.
 *
 * Re-deploy note: if you edit this script later, use
 * Deploy ▸ Manage deployments ▸ (edit) ▸ Version: New version,
 * so the same URL keeps working.
 */

// Optional: set this to a specific tab name. Leave "" to use the first sheet.
var SHEET_NAME = "";

var HEADERS = [
  "Timestamp",
  "X Username",
  "Liked & Retweeted",
  "Comment Link",
  "Wallet (EVM)",
  "Source",
  "User Agent"
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME || "Waitlist");

  // Add a header row the first time.
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
         .setFontWeight("bold")
         .setBackground("#8AE1C2");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Receives the POST from the website and stores it. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // avoid two rows colliding

    var data = parseBody_(e);

    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      data.username       || "",
      data.liked_retweeted || "",
      data.comment_link   || "",
      data.wallet         || "",
      data.source         || "",
      data.user_agent     || ""
    ]);

    return json_({ result: "success" });
  } catch (err) {
    return json_({ result: "error", message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Accepts JSON body OR url-encoded form params. */
function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    var raw = e.postData.contents;
    try {
      return JSON.parse(raw);
    } catch (ignore) {
      // not JSON — fall through to form params
    }
  }
  return (e && e.parameter) ? e.parameter : {};
}

/** Visiting the URL in a browser shows a friendly status (lets you confirm it's live). */
function doGet() {
  return HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif;text-align:center;padding:40px;color:#3A2E33">' +
    '<h2>🧪 Axolotlies waitlist backend is running</h2>' +
    '<p>Submissions are saved to your Google Sheet. You can close this tab.</p></div>'
  );
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
