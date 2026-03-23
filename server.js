require("dotenv").config();

const express = require("express");
const axios = require("axios");
const multer = require("multer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Serve widget + uploads */
app.use(express.static("widget"));
app.use("/uploads", express.static("uploads"));

/* Multer storage config */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* API */

/* Create Ticket API */

app.post("/api/ticket", upload.single("multiple-files"), async (req, res) => {
  try {
    /* IMPORTANT: use multer-parsed body */
    const body = req.body || {};

    console.log("BODY:", body);
    console.log("FILE:", req.file);

    const name = body["your-name"];
    const email = body["your-email"];
    const issueType = body["issue-type"];
    const course = body["course"];
    const subject = body["your-subject"];
    const message = body["your-message"];

    const file = req.file;

    const fileUrl = file
      ? `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      : null;

    const payload = {
      type: "email",

      mailboxId: Number(process.env.MAILBOX_ID),

      subject: subject || "Support Ticket",

      customer: {
        email: email,
        firstName: name,
      },

      threads: [
        {
          type: "customer",
          text: `
Name: ${name || "N/A"}
Email: ${email || "N/A"}

Issue Type: ${issueType || "N/A"}
Course: ${course || "N/A"}

Message:
${message || "No message provided"}

Uploaded File:
${fileUrl || "No file uploaded"}
          `,
        },
      ],
    };

    const response = await axios.post(
      `${process.env.FREESCOUT_URL}/api/conversations`,
      payload,
      {
        headers: {
          "X-FreeScout-API-Key": process.env.FREESCOUT_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    res.json({
      success: true,
      conversationId: response.data.id,
    });
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.json({
      success: false,
      message: "Ticket creation failed",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
