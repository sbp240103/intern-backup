const express = require("express");
const { google } = require("googleapis");
const router = express.Router();
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS); // Service account credentials

// Authenticate using the service account
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/documents"],
});

// Create a Google Docs file and save it to the user's Google Drive
router.post("/create-doc", async (req, res) => {
  try {
    const { text } = req.body; // Get the text from the request body
    console.log("Request Body:", req.body); // Debugging log

    const authClient = await auth.getClient();
    const drive = google.drive({ version: "v3", auth: authClient });
    const docs = google.docs({ version: "v1", auth: authClient });

    // Create a new Google Docs file
    const doc = await docs.documents.create({
      requestBody: {
        title: "New Google Docs File",
      },
    });

    console.log("Google Docs File Created:", doc.data); // Debugging log

    // Get the document ID
    const documentId = doc.data.documentId;

    // Add the text to the Google Docs file
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: text,
            },
          },
        ],
      },
    });

    console.log("Text Added to Google Docs File"); // Debugging log

    // Share the file to make it accessible
    await drive.permissions.create({
      fileId: documentId,
      requestBody: {
        role: "reader", // Can be 'reader', 'writer', etc.
        type: "anyone", // Can be 'user', 'group', 'domain', or 'anyone'
      },
    });

    console.log("File permissions updated to public"); // Debugging log

    // Get the document's URL
    const file = await drive.files.get({
      fileId: documentId,
      fields: "webViewLink",
    });

    console.log("Google Docs File URL:", file.data.webViewLink); // Debugging log

    res.status(200).json({ message: "Google Docs file created and shared", url: file.data.webViewLink });
  } catch (error) {
    console.error("Error creating Google Docs file:", error); // Log the error
    res.status(500).json({ message: "Failed to create Google Docs file", error });
  }
});

// Upload the Google Docs file to the user's Google Drive
router.post("/upload-doc", async (req, res) => {
  try {
    const { text } = req.body; // Get the text from the request body

    if (!text) {
      return res.status(400).json({ message: "Please create a Google Docs file first" });
    }

    const authClient = await auth.getClient();
    const drive = google.drive({ version: "v3", auth: authClient });
    const docs = google.docs({ version: "v1", auth: authClient });

    // Create a new Google Docs file
    const doc = await docs.documents.create({
      requestBody: {
        title: "Uploaded Google Docs File",
      },
    });

    console.log("Google Docs File Created:", doc.data); // Debugging log

    // Get the document ID
    const documentId = doc.data.documentId;

    // Add the text to the Google Docs file
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: text,
            },
          },
        ],
      },
    });

    console.log("Text Added to Google Docs File"); // Debugging log

    // Share the file to make it accessible
    await drive.permissions.create({
      fileId: documentId,
      requestBody: {
        role: "reader", // Can be 'reader', 'writer', etc.
        type: "anyone", // Can be 'user', 'group', 'domain', or 'anyone'
      },
    });

    console.log("File permissions updated to public"); // Debugging log

    // Get the document's URL
    const file = await drive.files.get({
      fileId: documentId,
      fields: "webViewLink",
    });

    console.log("Google Docs File URL:", file.data.webViewLink); // Debugging log

    res.status(200).json({ message: "Google Docs file uploaded and shared", url: file.data.webViewLink });
  } catch (error) {
    console.error("Error uploading Google Docs file:", error); // Log the error
    res.status(500).json({ message: "Failed to upload Google Docs file", error });
  }
});

module.exports = router;