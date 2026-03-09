require("dotenv").config();

const express = require("express");
const axios = require("axios");
const multer = require("multer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* Serve widget files */
app.use(express.static("widget"));

const upload = multer({ dest: "uploads/" });

/* Create Ticket API */

app.post("/api/ticket", upload.single("multiple-files"), async (req, res) => {

  try {

    const name = req.body["your-name"];
    const email = req.body["your-email"];
    const issueType = req.body["issue-type"];
    const course = req.body["cf_course"];
    const subject = req.body["your-subject"];
    const message = req.body["your-message"];
    const fileLink = req.body["file-link"];
    const pageUrl = req.body["page-url"];

    const payload = {

      type: "email",

      mailboxId: Number(process.env.MAILBOX_ID),

      subject: subject || "Support Ticket",

      customer: {
        email: email,
        firstName: name
      },

      threads: [
        {
          type: "customer",
          text: `
Issue Type: ${issueType}

Course: ${course}

Message:
${message}

File Link: ${fileLink || "N/A"}

Page URL:
${pageUrl}
          `
        }
      ]

    };

    const response = await axios.post(
      `${process.env.FREESCOUT_URL}/api/conversations`,
      payload,
      {
        headers: {
          "X-FreeScout-API-Key": process.env.FREESCOUT_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      conversationId: response.data.id
    });

  } catch (error) {

    console.log("FreeScout Error:");

    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    res.json({
      success: false,
      message: "Ticket creation failed"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
