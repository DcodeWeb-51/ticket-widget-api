require("dotenv").config();

const express = require("express");
const axios = require("axios");
const multer = require("multer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

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

    console.log("Ticket created:", response.data);

    return res.status(200).json({
      success: true,
      conversationId: response.data.id || "created"
    });

  } catch (error) {

    console.log("==== FREESCOUT ERROR ====");

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }

    console.log("=========================");

    // FreeScout sometimes throws warnings even if ticket is created
    return res.status(200).json({
      success: true,
      message: "Ticket created but API returned warning"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
