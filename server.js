import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import mailgun from "mailgun-js";

dotenv.config();

const app = express();
const port = 3000;

const mg = mailgun({
  apiKey: process.env.MG_KEY,
  domain: process.env.MG_DOMAIN,
});

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  const { county, name, email, phone, address, provider, averagebill } =
    req.body;

  // Create the email message
  const mailOptions = {
    from: "davidgoldsolar@yahoo.com", // Sender's address
    to: "davidgoldsolar@yahoo.com", // Recipient's address
    subject: "New Form Submission",
    text: `
      County: ${county}
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Address: ${address}
      Provider: ${provider}
      Average Monthly Bill: ${averagebill}
    `,
  };

  try {
    const data = {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
    };

    mg.messages().send(data, (error, body) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, error: "Error sending email" });
      } else {
        console.log("Response:", body);
        res.status(200).json({ success: true, message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Error sending email" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
