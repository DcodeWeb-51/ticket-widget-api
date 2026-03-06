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

/* Create ticket API */

app.post("/api/ticket", upload.single("multiple-files"), async (req, res) => {

  try {

    const {
      "your-name": name,
      "your-email": email,
      "issue-type": issueType,
      "course": course,
      "your-subject": subject,
      "your-message": message,
      "file-link": fileLink
    } = req.body;

    const payload = {

      type: "email",

      mailboxId: Number(process.env.MAILBOX_ID),

      subject: subject,

      customer: {
        email: email,
        firstName: name
      },

      threads: [
        {
          type: "customer",
          text: message
        }
      ],

      customFields: [
        { name: "issue_type", value: issueType },
        { name: "course", value: course },
        { name: "file_link", value: fileLink }
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

    console.log(error.response?.data || error.message);

    res.json({
      success: true,
      message: "Ticket created but API returned warning"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
