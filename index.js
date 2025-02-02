import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import cron from "node-cron";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000/"],
    methods: "GET, POST",
  })
); // Allow frontend

// User List
const userlist = [
  { id: 1, name: "Jay", email: "jay@gmail.com", IDofcategoryList: 4 },
  { id: 2, name: "Ramesh", email: "ramesh@gmail.com", IDofcategoryList: 1 },
  { id: 3, name: "Priya", email: "priya@yahoo.com", IDofcategoryList: 2 },
  { id: 4, name: "Amit", email: "amit@hotmail.com", IDofcategoryList: 3 },
  { id: 5, name: "Sneha", email: "sneha@gmail.com", IDofcategoryList: 4 },
  { id: 6, name: "Vikram", email: "vikram@outlook.com", IDofcategoryList: 1 },
  { id: 7, name: "Neha", email: "neha@gmail.com", IDofcategoryList: 2 },
  { id: 8, name: "Suresh", email: "suresh@yahoo.com", IDofcategoryList: 3 },
  { id: 9, name: "Anjali", email: "anjali@gmail.com", IDofcategoryList: 4 },
  {
    id: 10,
    name: "Tapasvi",
    email: "thchhabhaiya@gmail.com",
    IDofcategoryList: 5,
  },
  {
    id: 11,
    name: "Tapasvi (Parul University)",
    email: "210303105707@paruluniversity.ac.in",
    IDofcategoryList: 5,
  },
];

// Category List
const categorylist = [
  { categoryID: 1, categoryName: "New Joinees" },
  { categoryID: 2, categoryName: "HR Department" },
  { categoryID: 3, categoryName: "Marketing Team" },
  { categoryID: 4, categoryName: "Interns & Trainees" },
  { categoryID: 5, categoryName: "Executive Leadership" },
];

// Schedule Mail List
// let scheduleMail = [
//   {
//     scheduleMailID: 1,
//     template: "Salary Increment Letter",
//     schedule: "2025-02-02T01:31",
//     recipient: ["krishna@gmail.com", "ram@gmail.com"],
//   },
// ];
let scheduleMail = [];

// Template List
const template_List = [
  { template_id: 1, template_name: "New Offer Letter" },
  { template_id: 2, template_name: "Company Event Invitation" },
  { template_id: 3, template_name: "Employee Promotion Notice" },
  { template_id: 4, template_name: "Salary Increment Letter" },
  { template_id: 5, template_name: "Termination Letter" },
];

function sendEmail(recipient, scheduleDate) {
  return new Promise(async (resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "regionalnewsapp2025@gmail.com",
          pass: "tcxyzmiolvtxcwqi",
        },
      });

      const info = await transporter.sendMail({
        from: "regionalnewsapp2025@gmail.com",
        to: recipient,
        subject: `Termination Letter Hello THPA✔ by ${scheduleDate}`,
        text: "Hello world?",
        html: "<b>Hello world?</b>",
      });

      console.log("Message sent: %s", info.messageId);
      resolve({ message: "EMAIL SENT SUCCESSFULLY" });
    } catch (error) {
      console.error("Email send error:", error);
      reject({ message: "EMAIL FAILED TO SEND" });
    }
  });
}

//  Route 1: Get all data (Users, Categories, Scheduled Mails)
app.get("/api/data", (req, res) => {
  res.json({ userlist, categorylist, scheduleMail });
});

//  Route 2: Get Template List
app.get("/api/templates", (req, res) => {
  res.json(template_List);
});

//  Route 4: Get ScheduleMail List
app.get("/api/scheduleMail", (req, res) => {
  res.json(scheduleMail); // Send the scheduleMail list in the response
});

// Route 5: Get Categorylist List
app.get("/api/categorylist", (req, res) => {
  res.json(categorylist);
});

//  Route 5: Get Userlist List
app.get("/api/userlist", (req, res) => {
  res.json(userlist);
});

// app.get("/api/sendemail", (req, res) => {
//   sendEmail()
//     .then((response) => res.send(response.message))
//     .catch((error) => res.status(500).send(error.message));
// });

//  Route 3: Add New Scheduled Mail
app.post("/api/scheduleMail", (req, res) => {
  const { template, schedule, recipient } = req.body;
  if (!template || !schedule || !recipient) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const scheduleDate = new Date(schedule);
    const cronTime = `${scheduleDate.getMinutes()} ${scheduleDate.getHours()} ${scheduleDate.getDate()} ${
      scheduleDate.getMonth() + 1
    } *`;

    console.log(`Scheduling email at: ${cronTime}`);
    // Schedule the email using node-cron
    cron.schedule(cronTime, async () => {
      console.log(`Sending scheduled email for: ${template}`);
      await sendEmail(recipient, scheduleDate);
    });

    const newSchedule = {
      scheduleMailID: Date.now(),
      template,
      schedule,
      recipient,
    };

    scheduleMail.push(newSchedule);
    res
      .status(201)
      .json({ message: "Email sent and scheduled successfully", newSchedule });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.post("/delete/scheduleMail", (req, res) => {
  const { scheduleMailID } = req.body;
  const index = scheduleMail.findIndex(
    (item) => item.scheduleMailID === scheduleMailID
  );

  if (index !== -1) {
    // Remove the item if found
    scheduleMail.splice(index, 1);
    res.status(200).json({ message: "Scheduled mail deleted successfully." });
  } else {
    res.status(404).json({ error: "Scheduled mail not found." });
  }
});

//  Start Server
const PORT = 3012;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
